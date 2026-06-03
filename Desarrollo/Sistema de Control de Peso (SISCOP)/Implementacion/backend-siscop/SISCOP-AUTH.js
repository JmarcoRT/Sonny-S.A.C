// SISCOP – Sistema de Control de Pacientes Nutricionales
// Clínica San Fernando
// SISCOP-AUTH.js – Módulo de Autenticación (JWT + bcrypt)
// Versión: 1.0 | Fecha: 21/05/2026

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Usuario } = require('./SISCOP-MOD');

const JWT_SECRET     = process.env.JWT_SECRET     || 'siscop-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const BCRYPT_SALT    = 10;

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
const hashPassword = async (plain) => bcrypt.hash(plain, BCRYPT_SALT);

const verificarPassword = async (plain, hash) => bcrypt.compare(plain, hash);

const firmarToken = (usuario) =>
  jwt.sign(
    {
      id:      usuario.id_usuario,
      email:   usuario.email,
      usuario: usuario.usuario,
      rol:     usuario.rol,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

const verificarToken = (token) => jwt.verify(token, JWT_SECRET);

// ─────────────────────────────────────────────
//  Servicio: Login
//  Acepta usuario o email indistintamente.
// ─────────────────────────────────────────────
const loginUsuario = async ({ usuario, contrasena }) => {
  const identificador = String(usuario || '').trim();

  const u = await Usuario.findOne({
    where: {
      activo: true,
      [Op.or]: [
        { usuario: identificador },
        { email:   identificador.toLowerCase() },
      ],
    },
  });

  if (!u) {
    const err = new Error('Usuario o contraseña incorrectos.');
    err.status = 401;
    throw err;
  }

  const ok = await verificarPassword(contrasena, u.password_hash);
  if (!ok) {
    const err = new Error('Usuario o contraseña incorrectos.');
    err.status = 401;
    throw err;
  }

  const token = firmarToken(u);

  return {
    token,
    usuario: {
      id:        u.id_usuario,
      nombre:    u.nombre,
      apellidos: u.apellidos,
      email:     u.email,
      usuario:   u.usuario,
      // Frontend espera 'Nutricionista' | 'Recepcionista' con mayúscula inicial
      rol:       u.rol.charAt(0).toUpperCase() + u.rol.slice(1),
    },
  };
};

// ─────────────────────────────────────────────
//  Middleware: requireAuth
//  Verifica el JWT del header Authorization.
// ─────────────────────────────────────────────
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      ok:      false,
      mensaje: 'Token de autenticación ausente o malformado.',
    });
  }

  try {
    req.auth = verificarToken(token);
    return next();
  } catch (e) {
    return res.status(401).json({
      ok:      false,
      mensaje: 'Token inválido o expirado.',
    });
  }
};

// ─────────────────────────────────────────────
//  Middleware: requireRol(...roles)
//  Restringe el endpoint a uno o varios roles.
// ─────────────────────────────────────────────
const requireRol = (...rolesPermitidos) => (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({ ok: false, mensaje: 'No autenticado.' });
  }
  if (!rolesPermitidos.includes(req.auth.rol)) {
    return res.status(403).json({
      ok:      false,
      mensaje: 'No tiene permisos para realizar esta acción.',
    });
  }
  return next();
};

// ─────────────────────────────────────────────
//  Exportaciones
// ─────────────────────────────────────────────
module.exports = {
  hashPassword,
  verificarPassword,
  firmarToken,
  verificarToken,
  loginUsuario,
  requireAuth,
  requireRol,
};
