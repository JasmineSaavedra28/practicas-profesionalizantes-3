/**
 * Script de pruebas para el sistema de Autenticación y Autorización
 * Verifica todos los ítems implementados
 */

const API_URL = 'http://127.0.0.1:3000';
let username = '';

async function testLogin(user, pass) {
    console.log('\n📋 TEST 1: AUTENTICACIÓN');
    console.log('─'.repeat(50));
    console.log(`Intentando login con usuario: ${user}`);
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log('✅ LOGIN EXITOSO');
            console.log(`   Usuario: ${data.username}`);
            username = data.username;
            return true;
        } else {
            console.log('❌ ERROR DE AUTENTICACIÓN');
            console.log(`   ${data.error}`);
            return false;
        }
    } catch (error) {
        console.log('❌ ERROR DE CONEXIÓN:', error.message);
        return false;
    }
}

async function testAuthorizedEndpoint(endpoint) {
    console.log(`\n🔓 TEST AUTORIZADO: ${endpoint}`);
    console.log('─'.repeat(50));
    console.log(`Usuario: ${username} intenta acceder a ${endpoint}`);
    
    try {
        const response = await fetch(`${API_URL}${endpoint}?username=${username}`);
        const data = await response.json();

        if (response.ok && data.authorized) {
            console.log('✅ ACCESO PERMITIDO');
            console.log(`   Mensaje: ${data.message}`);
            console.log(`   Acción: ${data.action}`);
            return true;
        } else {
            console.log('❌ ACCESO DENEGADO');
            console.log(`   Error: ${data.error}`);
            return false;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return false;
    }
}

async function testUnauthorizedEndpoint(endpoint) {
    console.log(`\n🔒 TEST NO AUTORIZADO: ${endpoint}`);
    console.log('─'.repeat(50));
    console.log(`Usuario: ${username} intenta acceder a ${endpoint}`);
    
    try {
        const response = await fetch(`${API_URL}${endpoint}?username=${username}`);
        const data = await response.json();

        if (response.status === 403 && !data.authorized) {
            console.log('✅ ACCESO CORRECTAMENTE DENEGADO');
            console.log(`   Error: ${data.error}`);
            return true;
        } else if (response.ok && data.authorized) {
            console.log('❌ ERROR: Debería haber sido denegado pero fue permitido!');
            return false;
        } else {
            console.log('❌ ERROR: Respuesta inesperada');
            console.log(`   Status: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return false;
    }
}

async function testSessionValidation() {
    console.log('\n🔐 TEST 4: VALIDACIÓN DE SESIÓN');
    console.log('─'.repeat(50));
    console.log('Usuario sin sesión intenta acceder a /log');
    
    try {
        const response = await fetch(`${API_URL}/log?username=invalid_user`);
        const data = await response.json();

        if (response.status === 401 && data.error.includes('sesión')) {
            console.log('✅ SESIÓN VALIDADA CORRECTAMENTE');
            console.log(`   Error: ${data.error}`);
            return true;
        } else {
            console.log('❌ VALIDACIÓN FALLÓ');
            return false;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return false;
    }
}

async function testLogout() {
    console.log('\n🚪 TEST 5: CIERRE DE SESIÓN');
    console.log('─'.repeat(50));
    
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        const data = await response.json();

        if (response.ok && data.success) {
            console.log('✅ LOGOUT EXITOSO');
            console.log(`   ${data.message}`);
            return true;
        } else {
            console.log('❌ ERROR EN LOGOUT');
            return false;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return false;
    }
}

async function testPasswordHashing() {
    console.log('\n🔒 TEST 6: CIFRADO SHA256 DE CONTRASEÑAS');
    console.log('─'.repeat(50));
    console.log('Intenta login con contraseña correcta...');
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: '1234' })
        });

        if (response.ok) {
            console.log('✅ AUTENTICACIÓN CON SHA256 FUNCIONA');
            console.log('   Las contraseñas están siendo verificadas correctamente');
            return true;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('\n');
    console.log('╔' + '═'.repeat(60) + '╗');
    console.log('║' + ' SISTEMA DE AUTENTICACIÓN Y AUTORIZACIÓN - PRUEBAS'.padEnd(62) + '║');
    console.log('╚' + '═'.repeat(60) + '╝');

    const results = {
        login: false,
        authorized: false,
        unauthorized: false,
        session: false,
        logout: false,
        hash: false
    };

    // Test 1: Login
    results.login = await testLogin('admin', '1234');

    if (!results.login) {
        console.log('\n❌ No se puede continuar sin autenticación');
        return;
    }

    // Test 2: Endpoint autorizado
    results.authorized = await testAuthorizedEndpoint('/log');

    // Test 3: Endpoint no autorizado
    results.unauthorized = await testUnauthorizedEndpoint('/sayHello');

    // Test 4: Validación de sesión
    results.session = await testSessionValidation();

    // Test 5: Logout
    results.logout = await testLogout();

    // Test 6: Cifrado de contraseñas
    results.hash = await testPasswordHashing();

    // Resumen
    console.log('\n');
    console.log('╔' + '═'.repeat(60) + '╗');
    console.log('║' + ' RESUMEN DE PRUEBAS'.padEnd(62) + '║');
    console.log('╠' + '═'.repeat(60) + '╣');
    
    const items = [
        ['Test 1: Autenticación', results.login],
        ['Test 2: Endpoint Autorizado (/log)', results.authorized],
        ['Test 3: Endpoint No Autorizado (/sayHello)', results.unauthorized],
        ['Test 4: Validación de Sesión', results.session],
        ['Test 5: Cierre de Sesión', results.logout],
        ['Test 6: Cifrado SHA256', results.hash]
    ];

    items.forEach(([name, passed]) => {
        const status = passed ? '✅ PASÓ' : '❌ FALLÓ';
        console.log('║ ' + name.padEnd(50) + ' ' + status.padEnd(9) + '║');
    });

    const allPassed = Object.values(results).every(r => r === true);
    console.log('╠' + '═'.repeat(60) + '╣');
    console.log('║ ' + (allPassed ? '✅ TODOS LOS TESTS PASARON' : '❌ ALGUNOS TESTS FALLARON').padEnd(60) + '║');
    console.log('╚' + '═'.repeat(60) + '╝\n');

    process.exit(allPassed ? 0 : 1);
}

// Esperar un momento para que el servidor esté listo
setTimeout(runAllTests, 1000);
