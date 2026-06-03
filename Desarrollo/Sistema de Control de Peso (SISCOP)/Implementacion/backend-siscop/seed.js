// SISCOP – Sistema de Control de Pacientes Nutricionales
// Clínica San Fernando
// seed.js – Inicialización de la base de datos con datos de prueba
//
// USO:
//   node seed.js           → conserva las tablas existentes y agrega lo que falte
//   node seed.js --reset   → DROP + CREATE de todas las tablas y reinserta datos
//
// Versión: 1.0 | Fecha: 21/05/2026

require('dotenv').config();

const { conectarDB, sequelize } = require('./SISCOP-CBD');
const { Usuario, Paciente, Evaluacion } = require('./SISCOP-MOD');
const { hashPassword } = require('./SISCOP-AUTH');

const RESET = process.argv.includes('--reset');

// ─────────────────────────────────────────────
//  Datos de siembra
// ─────────────────────────────────────────────
const USUARIOS = [
  {
    nombre:    'Carmen',
    apellidos: 'Silva',
    email:     'c.silva@hospital.gob.pe',
    usuario:   'nutri',
    password:  'siscop123',
    rol:       'nutricionista',
  },
  {
    nombre:    'Lucía',
    apellidos: 'Mendoza',
    email:     'l.mendoza@hospital.gob.pe',
    usuario:   'lucia',
    password:  'siscop123',
    rol:       'nutricionista',
  },
  {
    nombre:    'Roberto',
    apellidos: 'Vargas',
    email:     'r.vargas@hospital.gob.pe',
    usuario:   'recep',
    password:  'siscop123',
    rol:       'recepcionista',
  },
  {
    nombre:    'María',
    apellidos: 'Gómez',
    email:     'm.gomez@hospital.gob.pe',
    usuario:   'maria',
    password:  'siscop123',
    rol:       'recepcionista',
  },
];

const PACIENTES = [
  { nombres: 'Angie Danna',      apellidos: 'Jimenez Vera',     dni: '12345678', sexo: 'F', fecha_nacimiento: '1970-05-12', telefono: '955456876' },
  { nombres: 'Carlos Alberto',   apellidos: 'Ramos Quispe',     dni: '74839215', sexo: 'M', fecha_nacimiento: '1983-08-21', telefono: '965214783' },
  { nombres: 'Lucía Fernanda',   apellidos: 'Torres Paredes',   dni: '71462839', sexo: 'F', fecha_nacimiento: '1964-11-03', telefono: '956874123' },
  { nombres: 'José Manuel',      apellidos: 'Cárdenas Rojas',   dni: '70295184', sexo: 'M', fecha_nacimiento: '1978-02-14', telefono: '992341875' },
  { nombres: 'Renato Miguel',    apellidos: 'Castillo Núñez',   dni: '74583621', sexo: 'M', fecha_nacimiento: '1987-09-29', telefono: '964728315' },
  { nombres: 'Camila Alejandra', apellidos: 'Vargas León',      dni: '76921543', sexo: 'F', fecha_nacimiento: '2002-06-18', telefono: '973812456' },
  { nombres: 'Diego Andrés',     apellidos: 'Salazar Medina',   dni: '75918346', sexo: 'M', fecha_nacimiento: '1991-04-07', telefono: '981245670' },
  { nombres: 'Sergio Iván',      apellidos: 'Lozano Chávez',    dni: '74261835', sexo: 'M', fecha_nacimiento: '1968-12-25', telefono: '963741852' },
  { nombres: 'Daniela Rocío',    apellidos: 'Campos Silva',     dni: '72945186', sexo: 'F', fecha_nacimiento: '2006-03-30', telefono: '981563247' },
  { nombres: 'Patricia Elena',   apellidos: 'Mendoza Ruiz',     dni: '76521984', sexo: 'F', fecha_nacimiento: '1980-07-09', telefono: '978456123' },
];

// ─────────────────────────────────────────────
//  Ejecución
// ─────────────────────────────────────────────
(async () => {
  try {
    await conectarDB();

    if (RESET) {
      console.log('[SEED] Modo RESET: eliminando y recreando todas las tablas SISCOP…');
      await sequelize.sync({ force: true });
    } else {
      console.log('[SEED] Sincronizando esquema (sin destruir datos)…');
      await sequelize.sync({ alter: true });
    }

    // ── Usuarios ──────────────────────────────
    console.log('[SEED] Sembrando usuarios…');
    const usuariosCreados = {};
    for (const u of USUARIOS) {
      const [registro] = await Usuario.findOrCreate({
        where: { usuario: u.usuario },
        defaults: {
          nombre:        u.nombre,
          apellidos:     u.apellidos,
          email:         u.email,
          usuario:       u.usuario,
          password_hash: await hashPassword(u.password),
          rol:           u.rol,
          activo:        true,
        },
      });
      usuariosCreados[u.usuario] = registro;
      console.log(`   • ${u.usuario.padEnd(8)} (${u.rol}) → ${registro.email}`);
    }

    const recepcionista  = usuariosCreados['recep'];
    const nutricionista  = usuariosCreados['nutri'];

    // ── Pacientes ─────────────────────────────
    console.log('[SEED] Sembrando pacientes…');
    const pacientesCreados = [];
    for (const p of PACIENTES) {
      const [registro] = await Paciente.findOrCreate({
        where: { dni: p.dni },
        defaults: { ...p, tipo_documento: 'DNI', created_by: recepcionista.id_usuario },
      });
      pacientesCreados.push(registro);
    }
    console.log(`   • ${pacientesCreados.length} pacientes en BD.`);

    // ── Evaluaciones (solo si RESET) ──────────
    if (RESET) {
      console.log('[SEED] Sembrando evaluaciones de ejemplo (paciente 1)…');
      const angie = pacientesCreados[0];
      const muestras = [
        { fecha: '2026-04-13', peso: 67.2, talla: 165, perim: 75 },
        { fecha: '2026-03-16', peso: 69.0, talla: 165, perim: 76 },
        { fecha: '2026-02-09', peso: 70.8, talla: 165, perim: 78 },
        { fecha: '2026-01-12', peso: 72.9, talla: 165, perim: 80 },
        { fecha: '2025-12-15', peso: 74.8, talla: 165, perim: 82 },
      ];
      for (const m of muestras) {
        await Evaluacion.create({
          id_paciente:         angie.id_paciente,
          id_nutricionista:    nutricionista.id_usuario,
          fecha_evaluacion:    new Date(m.fecha),
          peso_kg:             m.peso,
          talla_cm:            m.talla,
          perimetro_abdom_cm:  m.perim,
          recomendaciones_ali: 'Dieta balanceada con reducción de carbohidratos simples.',
          recomendaciones_fis: 'Cardio 3 veces por semana, 30 minutos.',
        });
      }
    }

    console.log('\n[SEED] ✔ Listo. Credenciales de prueba (contraseña en todas: siscop123):');
    USUARIOS.forEach((u) => console.log(`   - ${u.usuario}  (${u.rol})`));

    await sequelize.close();
    process.exit(0);
  } catch (e) {
    console.error('[SEED] ✖ Error:', e);
    process.exit(1);
  }
})();
