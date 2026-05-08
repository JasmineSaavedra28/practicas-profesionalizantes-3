import {
    connect_db,
    crear_usuario,
    crear_rol,
    crear_permiso,
    asignar_permiso_a_rol
} from './src/db.mjs';
import { load_config } from './config.js';

const config = load_config();
const db = connect_db(config.database.path);

console.log('🌱 Iniciando inserción de datos de prueba...\n');

console.log('📋 Creando roles...');
const rolAdmin = crear_rol(db, 'Administrador', 'Usuario con acceso total al sistema');
const rolManager = crear_rol(db, 'Gerente', 'Gerente con permisos de lectura y escritura');
const rolUsuario = crear_rol(db, 'Usuario', 'Usuario estándar con permisos limitados');
const rolInvitado = crear_rol(db, 'Invitado', 'Usuario invitado de solo lectura');
console.log('✅ Roles creados:\n', [rolAdmin, rolManager, rolUsuario, rolInvitado], '\n');

console.log('🔑 Creando permisos...');
const permisos = [
    crear_permiso(db, 'crear_usuario', 'Permiso para crear nuevos usuarios'),
    crear_permiso(db, 'leer_usuario', 'Permiso para leer datos de usuarios'),
    crear_permiso(db, 'actualizar_usuario', 'Permiso para actualizar usuarios'),
    crear_permiso(db, 'eliminar_usuario', 'Permiso para eliminar usuarios'),
    crear_permiso(db, 'crear_rol', 'Permiso para crear nuevos roles'),
    crear_permiso(db, 'leer_rol', 'Permiso para leer roles'),
    crear_permiso(db, 'actualizar_rol', 'Permiso para actualizar roles'),
    crear_permiso(db, 'eliminar_rol', 'Permiso para eliminar roles'),
    crear_permiso(db, 'crear_permiso', 'Permiso para crear nuevos permisos'),
    crear_permiso(db, 'leer_permiso', 'Permiso para leer permisos'),
    crear_permiso(db, 'actualizar_permiso', 'Permiso para actualizar permisos'),
    crear_permiso(db, 'eliminar_permiso', 'Permiso para eliminar permisos'),
    crear_permiso(db, 'generar_reportes', 'Permiso para generar reportes'),
    crear_permiso(db, 'exportar_datos', 'Permiso para exportar datos'),
    crear_permiso(db, 'ver_logs', 'Permiso para ver logs del sistema')
];
console.log('✅ Permisos creados:', permisos.length, 'permisos\n');

console.log('🔗 Asignando permisos a roles...');
permisos.forEach((permiso) => {
    asignar_permiso_a_rol(db, rolAdmin.id, permiso.id);
});
[0, 1, 3, 5, 6, 9, 10, 12, 13].forEach(idx => {
    asignar_permiso_a_rol(db, rolManager.id, permisos[idx].id);
});
[1, 5, 9, 12].forEach(idx => {
    asignar_permiso_a_rol(db, rolUsuario.id, permisos[idx].id);
});
[1, 5, 9].forEach(idx => {
    asignar_permiso_a_rol(db, rolInvitado.id, permisos[idx].id);
});
console.log('✅ Permisos asignados a roles\n');

console.log('👥 Creando usuarios de prueba...');
const usuarios = [];
const nombresUsuarios = [
    { username: 'admin', email: 'admin@example.com', role: rolAdmin.id },
    { username: 'manager1', email: 'manager1@example.com', role: rolManager.id },
    { username: 'manager2', email: 'manager2@example.com', role: rolManager.id },
    { username: 'usuario1', email: 'usuario1@example.com', role: rolUsuario.id },
    { username: 'usuario2', email: 'usuario2@example.com', role: rolUsuario.id },
    { username: 'usuario3', email: 'usuario3@example.com', role: rolUsuario.id },
    { username: 'usuario4', email: 'usuario4@example.com', role: rolUsuario.id },
    { username: 'usuario5', email: 'usuario5@example.com', role: rolUsuario.id },
    { username: 'invitado1', email: 'invitado1@example.com', role: rolInvitado.id },
    { username: 'invitado2', email: 'invitado2@example.com', role: rolInvitado.id }
];
for (let i = 6; i <= 25; i++) {
    nombresUsuarios.push({
        username: `usuario_test_${i}`,
        email: `usuario_test_${i}@example.com`,
        role: i % 2 === 0 ? rolUsuario.id : rolInvitado.id
    });
}

nombresUsuarios.forEach(u => {
    const usuario = crear_usuario(db, u.username, 'password123', u.email, u.role);
    usuarios.push(usuario);
});

console.log('✅ Usuarios creados:', usuarios.length, 'usuarios\n');
console.log('📊 Resumen de datos insertados:');
console.log('   • Roles: 4');
console.log('   • Permisos: 15');
console.log('   • Usuarios: ' + usuarios.length);
console.log('\n✨ ¡Datos de prueba insertados exitosamente!');
