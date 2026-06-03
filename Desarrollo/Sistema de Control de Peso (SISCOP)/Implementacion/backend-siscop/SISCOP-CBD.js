// SISCOP – Sistema de Control de Pacientes Nutricionales
// Clínica San Fernando
// SISCOP-CBD.js – Módulo de Conexión a Base de Datos
// Versión: 1.0 | Fecha: 21/05/2026

const { Sequelize } = require('sequelize');
require('dotenv').config();

// ─────────────────────────────────────────────
//  Instancia de conexión a PostgreSQL
// ─────────────────────────────────────────────
const sequelize = new Sequelize(
  process.env.DB_NAME     || 'siscop_db',
  process.env.DB_USER     || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',

    // Pool de conexiones
    pool: {
      max:     10,
      min:     2,
      acquire: 30000,
      idle:    10000,
    },

    // Logging: activo solo en desarrollo
    logging: process.env.NODE_ENV === 'development'
      ? (msg) => console.log(`[Sequelize] ${msg}`)
      : false,

    define: {
      timestamps:  true,
      underscored: false,
      freezeTableName: true,
    },

    dialectOptions:
      (process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true')
        ? {
            ssl: {
              require:            true,
              rejectUnauthorized: false,
            },
          }
        : {},
  }
);

// ─────────────────────────────────────────────
//  Función de prueba de conexión
// ─────────────────────────────────────────────
const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('[SISCOP-CBD] Conexión a PostgreSQL establecida correctamente.');
  } catch (error) {
    console.error('[SISCOP-CBD] No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

// ─────────────────────────────────────────────
//  Función de sincronización (solo desarrollo)
// ─────────────────────────────────────────────
const sincronizarDB = async (opciones = {}) => {
  if (process.env.NODE_ENV === 'production') {
    console.warn('[SISCOP-CBD] sincronizarDB() deshabilitada en producción. Use migraciones Sequelize.');
    return;
  }

  try {
    await sequelize.sync(opciones);
    console.log('[SISCOP-CBD] Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('[SISCOP-CBD] Error al sincronizar modelos:', error.message);
    throw error;
  }
};

// ─────────────────────────────────────────────
//  Función de cierre de conexión
// ─────────────────────────────────────────────
const cerrarDB = async () => {
  try {
    await sequelize.close();
    console.log('[SISCOP-CBD] Conexión a la base de datos cerrada.');
  } catch (error) {
    console.error('[SISCOP-CBD] Error al cerrar la conexión:', error.message);
  }
};

// ─────────────────────────────────────────────
//  Exportaciones
// ─────────────────────────────────────────────
module.exports = {
  sequelize,
  conectarDB,
  sincronizarDB,
  cerrarDB,
};
