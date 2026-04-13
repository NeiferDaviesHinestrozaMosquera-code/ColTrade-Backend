const BASE_URL = 'http://localhost:3000/api/v1/auth';

async function testAuthFlow() {
  const email = `test_user_${Date.now()}@test.com`;
  const password = 'Password123!';

  console.log(`--- REGISTER ---`);
  console.log(`Intentando registrar usuario: ${email}`);

  const registerBody = {
    email: email,
    password: password,
    fullName: 'Test User',
    tenantSlug: `tenant-${Date.now()}`,
    tenantName: 'Test Tenant SAS',
    nit: '123456789-0'
  };

  try {
    const registerResponse = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerBody)
    });

    const registerData = await registerResponse.json();
    if (!registerResponse.ok) {
        console.error('Error en registro:', registerData);
        return;
    }
    console.log('Registro exitoso. Respuesta:', JSON.stringify(registerData, null, 2));

    console.log(`\n--- LOGIN ---`);
    console.log(`Intentando login con el usuario creado...`);
    const loginResponse = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
        console.error('Error en login:', loginData);
        return;
    }
    console.log('Login exitoso. Tokens y perfil recibidos:');
    console.log(`Access Token: ${loginData.accessToken.substring(0, 40)}...`);
    console.log('Perfil Usuario:', JSON.stringify(loginData.user, null, 2));
    if (loginData.tenant) {
        console.log('Tenant:', JSON.stringify(loginData.tenant, null, 2));
    }
    
  } catch (err) {
    console.error('Network request failed', err);
  }
}

testAuthFlow();
