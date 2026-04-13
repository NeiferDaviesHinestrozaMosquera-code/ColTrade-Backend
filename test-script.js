const http = require('http');

async function runTests() {
  const baseUrl = 'http://localhost:3000/api/v1';
  const timestamp = Date.now();
  const testEmail = `test_${timestamp}@example.com`;
  const testPassword = 'Password123!';

  console.log('--- Iniciando Pruebas de API ---');

  try {
    // 1. Health check
    console.log('\n[1] Probando GET /auth/health...');
    let res = await fetch(`${baseUrl}/auth/health`);
    let data = await res.json();
    console.log('Health:', data);
    if (res.status !== 200) throw new Error('Health check falló');

    // 2. Registro
    console.log(`\n[2] Probando POST /auth/register con email: ${testEmail}...`);
    res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        fullName: 'Prueba Integra',
        tenantSlug: `empresa-${timestamp}`,
        tenantName: `Empresa-${timestamp}`
      })
    });
    data = await res.json();
    console.log('Register Response:', res.status, data);
    if (res.status !== 201) throw new Error('Registro falló');

    // 3. Login
    console.log('\n[3] Probando POST /auth/login...');
    res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    data = await res.json();
    if (res.status !== 200) {
      console.log('Login Response:', res.status, data);
      throw new Error('Login falló');
    }
    const token = data.accessToken;
    console.log('Login OK. Recuperamos accessToken:', token ? 'Si' : 'No');

    // 4. Perfil (Me)
    console.log('\n[4] Probando GET /auth/me...');
    res = await fetch(`${baseUrl}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    data = await res.json();
    console.log('Me Response:', res.status, data.id ? `Usuario ID obtenido: ${data.id}` : data);
    if (res.status !== 200) throw new Error('Obtener Me falló');

    // 5. Crear Operación
    console.log('\n[5] Probando POST /operations...');
    res = await fetch(`${baseUrl}/operations`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        type: 'IMPORT',
        reference: `REF-${timestamp}`,
        value: 12500.50,
        currency: 'USD'
      })
    });
    data = await res.json();
    console.log('Crear Operación:', res.status, data.id ? `Operación creada con ID: ${data.id}` : data);
    if (res.status !== 201) throw new Error('Crear operación falló');

    // 6. Listar Operaciones
    console.log('\n[6] Probando GET /operations?limit=10...');
    res = await fetch(`${baseUrl}/operations?limit=10`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    data = await res.json();
    console.log('Listar Operaciones:', res.status, `Resultados encontrados: ${data.data?.length || 0}`);
    if (res.status !== 200) throw new Error('Listar operaciones falló');

    console.log('\n✅ TODAS LAS PRUEBAS FUNCIONALES PASARON CON ÉXITO.');

  } catch (err) {
    console.error('\n❌ ERROR DURANTE LAS PRUEBAS:', err.message);
  }
}

runTests();
