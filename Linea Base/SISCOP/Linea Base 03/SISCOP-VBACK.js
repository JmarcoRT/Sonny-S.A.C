// SISCOP – Sistema de Control de Pacientes Nutricionales
// Clínica San Fernando
// SISCOP-VBACK.js – Validaciones de entrada del Backend (express-validator)
// Versión: 1.0 | Fecha: 21/05/2026

const { body, param, query, validationResult } = require('express-validator');

// ─────────────────────────────────────────────
//  Middleware genérico: aplica las reglas y, si
//  detecta errores, responde 400 con detalle.
// ─────────────────────────────────────────────
const aplicarValidaciones = (req, res, next) => {
  const errores = validationResult(req);
  if (errores.isEmpty()) return next();

  return res.status(400).json({
    ok:      false,
    mensaje: 'Errores de validación en la solicitud.',
    errores: errores.array().map((e) => ({
      campo:   e.path,
      mensaje: e.msg,
      valor:   e.value,
    })),
  });
};

// ═══════════════════════════════════════════════
//  LOGIN
// ═══════════════════════════════════════════════
const validarLogin = [
  body('usuario')
    .trim()
    .notEmpty().withMessage('El campo usuario es obligatorio.')
    .isLength({ min: 3, max: 150 }).withMessage('El usuario debe tener entre 3 y 150 caracteres.'),
  body('contrasena')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 6, max: 100 }).withMessage('La contraseña debe tener entre 6 y 100 caracteres.'),
  aplicarValidaciones,
];

// ═══════════════════════════════════════════════
//  PACIENTE – Crear / Actualizar
// ═══════════════════════════════════════════════
const validarPaciente = [
  body('nombres')
    .trim()
    .notEmpty().withMessage('Los nombres son obligatorios.')
    .isLength({ min: 2, max: 100 }).withMessage('Los nombres deben tener entre 2 y 100 caracteres.'),

  body('apellidos')
    .trim()
    .notEmpty().withMessage('Los apellidos son obligatorios.')
    .isLength({ min: 2, max: 100 }).withMessage('Los apellidos deben tener entre 2 y 100 caracteres.'),

  body('dni')
    .trim()
    .notEmpty().withMessage('El número de documento es obligatorio.')
    .matches(/^\d{6,20}$/).withMessage('El documento debe contener solo dígitos (6 a 20).'),

  body('tipo_documento')
    .optional()
    .isIn(['DNI', 'Carnet de Extranjería']).withMessage('Tipo de documento no válido.'),

  body('sexo')
    .notEmpty().withMessage('El sexo es obligatorio.')
    .isIn(['M', 'F']).withMessage('El sexo debe ser "M" o "F".'),

  body('fecha_nacimiento')
    .notEmpty().withMessage('La fecha de nacimiento es obligatoria.')
    .isISO8601().withMessage('La fecha de nacimiento debe tener formato YYYY-MM-DD.')
    .custom((val) => {
      const hoy = new Date();
      const fn  = new Date(val);
      if (fn >= hoy) throw new Error('La fecha de nacimiento debe ser anterior a hoy.');
      return true;
    }),

  body('telefono')
    .optional({ checkFalsy: true })
    .matches(/^\+?\d{9,15}$/).withMessage('Ingrese un teléfono válido (9 a 15 dígitos).'),

  aplicarValidaciones,
];

// ═══════════════════════════════════════════════
//  EVALUACIÓN
// ═══════════════════════════════════════════════
const validarEvaluacion = [
  body('id_paciente')
    .notEmpty().withMessage('El paciente es obligatorio.')
    .isInt({ min: 1 }).withMessage('El paciente debe ser un identificador válido.'),

  body('peso_kg')
    .notEmpty().withMessage('El peso es obligatorio.')
    .isFloat({ min: 1, max: 500 }).withMessage('El peso debe estar entre 1 y 500 kg.'),

  body('talla_cm')
    .notEmpty().withMessage('La talla es obligatoria.')
    .isFloat({ min: 50, max: 250 }).withMessage('La talla debe estar entre 50 y 250 cm.'),

  body('perimetro_abdom_cm')
    .optional({ checkFalsy: true })
    .isFloat({ min: 1, max: 300 }).withMessage('El perímetro abdominal debe estar entre 1 y 300 cm.'),

  body('recomendaciones_ali').optional().isString().isLength({ max: 5000 }),
  body('recomendaciones_fis').optional().isString().isLength({ max: 5000 }),

  body('fecha_proximo_ctrl')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La fecha del próximo control debe ser una fecha válida.'),

  aplicarValidaciones,
];

// ═══════════════════════════════════════════════
//  Helpers: validación de parámetros y queries
// ═══════════════════════════════════════════════
const validarIdParam = [
  param('id').isInt({ min: 1 }).withMessage('El identificador debe ser un entero positivo.'),
  aplicarValidaciones,
];

const validarFiltrosPaciente = [
  query('nombre').optional().isString().isLength({ max: 100 }),
  query('documento').optional().isString().isLength({ max: 20 }),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  aplicarValidaciones,
];

// ─────────────────────────────────────────────
//  Exportaciones
// ─────────────────────────────────────────────
module.exports = {
  aplicarValidaciones,
  validarLogin,
  validarPaciente,
  validarEvaluacion,
  validarIdParam,
  validarFiltrosPaciente,
};
