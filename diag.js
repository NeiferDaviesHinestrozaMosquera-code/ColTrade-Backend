require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const prisma = new PrismaClient();

async function test() {
  try {
    const ts = Date.now();
    const email = 'fulltest_' + ts + '@coltrade.dev';
    const slug = 'tenant-' + ts;

    console.log('1. Creando usuario en Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email, password: 'TestPass123!', email_confirm: true,
      user_metadata: { full_name: 'Test User', tenant_slug: slug }
    });
    if (authError) throw new Error('Supabase Auth: ' + authError.message);
    const uid = authData.user.id;
    console.log('   ✅ OK - UID:', uid);

    console.log('2. Verificando si usuario ya existe en DB...');
    const existing = await prisma.user.findFirst({ where: { email } });
    console.log('   Existente:', existing ? 'SI' : 'NO');

    console.log('3. Creando Tenant en DB...');
    const tenant = await prisma.tenant.create({ data: { name: 'Test Company', slug } });
    console.log('   ✅ OK - Tenant ID:', tenant.id);

    console.log('4. Creando User en DB...');
    const user = await prisma.user.create({
      data: { id: uid, email, tenantId: tenant.id, role: 'ADMIN' },
      include: { tenant: { select: { id: true, name: true, slug: true } } }
    });
    console.log('   ✅ OK - User ID:', user.id);

    console.log('5. Login inmediato con Supabase...');
    const { data: sess, error: sessErr } = await supabase.auth.signInWithPassword({
      email, password: 'TestPass123!'
    });
    if (sessErr) throw new Error('Login: ' + sessErr.message);
    const token = sess.session.access_token;
    console.log('   ✅ OK - Token:', token.substring(0, 40) + '...');

    console.log('\n✅ FLUJO COMPLETO DE REGISTRO OK\n');
    console.log('Respuesta esperada del API:');
    console.log(JSON.stringify({
      accessToken: token.substring(0, 20) + '...',
      refreshToken: sess.session.refresh_token.substring(0, 20) + '...',
      expiresIn: sess.session.expires_in,
      user: { id: user.id, email: user.email, role: user.role, tenant: user.tenant }
    }, null, 2));

    // Cleanup
    console.log('\nLimpiando datos de prueba...');
    await prisma.user.delete({ where: { id: uid } });
    await prisma.tenant.delete({ where: { id: tenant.id } });
    await supabase.auth.admin.deleteUser(uid);
    console.log('✅ Datos eliminados correctamente.');

  } catch(e) {
    console.error('\n❌ ERROR:', e.message);
    if (e.code) console.error('   Código Prisma:', e.code);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

test();
