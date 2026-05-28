// SISCOP – Sistema de Control de Pacientes Nutricionales
// Clínica San Fernando
// SISCOP-API.js – Capa REST (Express Router)
// Versión: 1.0 | Fecha: 21/05/2026

const express = require('express');

const { loginUsuario, requireAuth, requireRol } = require('./SISCOP-AUTH');
const { pacientesSrv, evaluacionesSrv, dashboardSrv } = require('./SISCOP-SRV');
const {
  validarLogin,
  validarPaciente,
  validarEvaluacion,
  validarIdParam,
  validarFiltrosPaciente,
} = require('./SISCOP-VBACK');
const reportes = require('./SISCOP-RPDF');

const router = express.Router();

// ─────────────────────────────────────────────
//  Wrapper de errores async
// ─────────────────────────────────────────────
const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ═════════════════════════════════════════════
//  HEALTHCHECK
// ═════════════════════════════════════════════
router.get('/health', (req, res) => {
  res.json({ ok: true, servicio: 'SISCOP-API', timestamp: new Date().toISOString() });
});

// ═════════════════════════════════════════════
//  AUTENTICACIÓN
// ═════════════════════════════════════════════
router.post(
  '/auth/login',
  validarLogin,
  wrap(async (req, res) => {
    const datos = await loginUsuario({
      usuario:    req.body.usuario,
      contrasena: req.body.contrasena,
    });
    res.json({ ok: true, ...datos });
  })
);

router.get(
  '/auth/me',
  requireAuth,
  wrap(async (req, res) => {
    res.json({ ok: true, auth: req.auth });
  })
);

// ═════════════════════════════════════════════
//  PACIENTES
// ═════════════════════════════════════════════
router.get(
  '/pacientes',
  requireAuth,
  validarFiltrosPaciente,
  wrap(async (req, res) => {
    const resultado = await pacientesSrv.listar({
      nombre:    req.query.nombre,
      documento: req.query.documento,
      page:      req.query.page  || 1,
      limit:     req.query.limit || 8,
    });
    res.json({ ok: true, ...resultado });
  })
);

router.get(
  '/pacientes/:id',
  requireAuth,
  validarIdParam,
  wrap(async (req, res) => {
    const data = await pacientesSrv.obtenerPorId(req.params.id);
    res.json({ ok: true, data });
  })
);

router.post(
  '/pacientes',
  requireAuth,
  requireRol('Recepcionista'),
  validarPaciente,
  wrap(async (req, res) => {
    const data = await pacientesSrv.crear(req.body, req.auth.id, req.ip);
    res.status(201).json({ ok: true, data });
  })
);

router.put(
  '/pacientes/:id',
  requireAuth,
  requireRol('Recepcionista'),
  validarIdParam,
  validarPaciente,
  wrap(async (req, res) => {
    const data = await pacientesSrv.actualizar(req.params.id, req.body, req.auth.id, req.ip);
    res.json({ ok: true, data });
  })
);

// ═════════════════════════════════════════════
//  EVALUACIONES
// ═════════════════════════════════════════════
router.get(
  '/pacientes/:id/evaluaciones',
  requireAuth,
  validarIdParam,
  wrap(async (req, res) => {
    const data = await evaluacionesSrv.listarPorPaciente(req.params.id);
    res.json({ ok: true, data });
  })
);

router.post(
  '/evaluaciones',
  requireAuth,
  requireRol('Nutricionista'),
  validarEvaluacion,
  wrap(async (req, res) => {
    const data = await evaluacionesSrv.crear(req.body, req.auth.id, req.ip);
    res.status(201).json({ ok: true, data });
  })
);

// ═════════════════════════════════════════════
//  DASHBOARD
// ═════════════════════════════════════════════
router.get(
  '/dashboard',
  requireAuth,
  wrap(async (req, res) => {
    const data = await dashboardSrv.resumen();
    res.json({ ok: true, data });
  })
);

// ═════════════════════════════════════════════
//  REPORTES PDF
// ═════════════════════════════════════════════
router.get(
  '/pacientes/:id/reporte/historial',
  requireAuth,
  validarIdParam,
  wrap(async (req, res) => {
    await reportes.historialClinico(req.params.id, res);
  })
);

router.get(
  '/evaluaciones/:id/reporte',
  requireAuth,
  validarIdParam,
  wrap(async (req, res) => {
    await reportes.evaluacion(req.params.id, res);
  })
);

// ─────────────────────────────────────────────
//  Exportación del router
// ─────────────────────────────────────────────
module.exports = router;
