// SISCOP – Sistema de Control de Pacientes Nutricionales
// Clínica San Fernando
// server.js – Punto de entrada del backend HTTP
// Versión: 1.0 | Fecha: 21/05/2026

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const { conectarDB } = require('./SISCOP-CBD');
require('./SISCOP-MOD'); // registra los modelos y sus asociaciones

const apiRouter = require('./SISCOP-API');

const app  = express();
const PORT = parseInt(process.env.PORT, 10) || 3000;

// ─────────────────────────────────────────────
//  Middlewares globales
// ─────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// ─────────────────────────────────────────────
//  API
// ─────────────────────────────────────────────
app.use('/api', apiRouter);

// ─────────────────────────────────────────────
//  404 + manejador de errores
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.error(`[SISCOP-API] ${status} ${err.message}`);
  if (status >= 500) console.error(err.stack);
  res.status(status).json({
    ok:      false,
    mensaje: err.message || 'Error interno del servidor.',
  });
});

// ─────────────────────────────────────────────
//  Arranque
// ─────────────────────────────────────────────
(async () => {
  await conectarDB();
  app.listen(PORT, () => {
    console.log(`[SISCOP] Backend escuchando en http://localhost:${PORT}`);
    console.log(`[SISCOP] API base: http://localhost:${PORT}/api`);
  });
})();
