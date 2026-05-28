// SISCOP – Sistema de Control de Pacientes Nutricionales
// Clínica San Fernando
// SISCOP-SRV.js – Servicios / Lógica de Negocio
// Versión: 1.0 | Fecha: 21/05/2026

const { Op } = require('sequelize');
const { sequelize } = require('./SISCOP-CBD');
const { Usuario, Paciente, Evaluacion, Auditoria } = require('./SISCOP-MOD');

// ─────────────────────────────────────────────
//  Utilidades comunes
// ─────────────────────────────────────────────
const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;
  const nac = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad < 0 ? 0 : edad;
};

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const d = new Date(fecha);
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  return `${yyyy} / ${mm} / ${dd}`;
};

const registrarAuditoria = async (datos) => {
  try {
    await Auditoria.create(datos);
  } catch (e) {
    // Auditoría no debe bloquear la operación principal.
    console.error('[SISCOP-SRV] Error al registrar auditoría:', e.message);
  }
};

// ═══════════════════════════════════════════════
//  SERVICIO: PACIENTES
// ═══════════════════════════════════════════════
const pacientesSrv = {
  /**
   * Lista pacientes con filtros opcionales y paginación.
   * Cada paciente incluye fecha del último registro de evaluación.
   */
  async listar({ nombre, documento, page = 1, limit = 8 } = {}) {
    const where = {};

    if (nombre) {
      where[Op.or] = [
        { nombres:   { [Op.iLike]: `%${nombre}%` } },
        { apellidos: { [Op.iLike]: `%${nombre}%` } },
      ];
    }
    if (documento) {
      where.dni = { [Op.iLike]: `%${documento}%` };
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Paciente.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model:      Evaluacion,
          as:         'evaluaciones',
          attributes: ['fecha_evaluacion'],
          separate:   true,
          order:      [['fecha_evaluacion', 'DESC']],
          limit:      1,
        },
      ],
    });

    const data = rows.map((p) => {
      const ultima = p.evaluaciones && p.evaluaciones[0];
      return {
        id:                  String(p.id_paciente),
        nombre:              p.nombres,
        apellido:            p.apellidos,
        documento:           p.dni,
        tipoDocumento:       p.tipo_documento,
        sexo:                p.sexo === 'F' ? 'Femenino' : 'Masculino',
        edad:                calcularEdad(p.fecha_nacimiento),
        telefono:            p.telefono || '',
        fechaNacimiento:     p.fecha_nacimiento,
        fechaUltimoRegistro: ultima ? formatearFecha(ultima.fecha_evaluacion) : formatearFecha(p.created_at),
      };
    });

    return {
      data,
      paginacion: {
        total:       count,
        page,
        limit,
        totalPages:  Math.max(1, Math.ceil(count / limit)),
      },
    };
  },

  async obtenerPorId(id) {
    const p = await Paciente.findByPk(id);
    if (!p) {
      const e = new Error('Paciente no encontrado.');
      e.status = 404;
      throw e;
    }
    return {
      id:              String(p.id_paciente),
      nombre:          p.nombres,
      apellido:        p.apellidos,
      documento:       p.dni,
      tipoDocumento:   p.tipo_documento,
      sexo:            p.sexo === 'F' ? 'Femenino' : 'Masculino',
      edad:            calcularEdad(p.fecha_nacimiento),
      telefono:        p.telefono || '',
      fechaNacimiento: p.fecha_nacimiento,
    };
  },

  async crear(datos, autorId, ip) {
    // Verificar DNI único
    const existe = await Paciente.findOne({ where: { dni: datos.dni } });
    if (existe) {
      const e = new Error('Ya existe un paciente con ese número de documento.');
      e.status = 409;
      throw e;
    }

    const nuevo = await Paciente.create({
      nombres:          datos.nombres,
      apellidos:        datos.apellidos,
      dni:              datos.dni,
      tipo_documento:   datos.tipo_documento || 'DNI',
      sexo:             datos.sexo,
      fecha_nacimiento: datos.fecha_nacimiento,
      telefono:         datos.telefono || null,
      created_by:       autorId,
    });

    await registrarAuditoria({
      id_usuario:   autorId,
      accion:       'CREATE',
      entidad:      'PACIENTE',
      id_entidad:   nuevo.id_paciente,
      datos_nuevos: nuevo.toJSON(),
      ip_origen:    ip,
    });

    return this.obtenerPorId(nuevo.id_paciente);
  },

  async actualizar(id, datos, autorId, ip) {
    const p = await Paciente.findByPk(id);
    if (!p) {
      const e = new Error('Paciente no encontrado.');
      e.status = 404;
      throw e;
    }

    // Si cambia el DNI, validar unicidad
    if (datos.dni && datos.dni !== p.dni) {
      const dup = await Paciente.findOne({ where: { dni: datos.dni } });
      if (dup) {
        const e = new Error('Ya existe otro paciente con ese número de documento.');
        e.status = 409;
        throw e;
      }
    }

    const previos = p.toJSON();

    await p.update({
      nombres:          datos.nombres          ?? p.nombres,
      apellidos:        datos.apellidos        ?? p.apellidos,
      dni:              datos.dni              ?? p.dni,
      tipo_documento:   datos.tipo_documento   ?? p.tipo_documento,
      sexo:             datos.sexo             ?? p.sexo,
      fecha_nacimiento: datos.fecha_nacimiento ?? p.fecha_nacimiento,
      telefono:         datos.telefono         ?? p.telefono,
    });

    await registrarAuditoria({
      id_usuario:    autorId,
      accion:        'UPDATE',
      entidad:       'PACIENTE',
      id_entidad:    p.id_paciente,
      datos_previos: previos,
      datos_nuevos:  p.toJSON(),
      ip_origen:     ip,
    });

    return this.obtenerPorId(p.id_paciente);
  },
};

// ═══════════════════════════════════════════════
//  SERVICIO: EVALUACIONES
// ═══════════════════════════════════════════════
const evaluacionesSrv = {
  async listarPorPaciente(idPaciente) {
    const lista = await Evaluacion.findAll({
      where: { id_paciente: idPaciente },
      order: [['fecha_evaluacion', 'DESC']],
      include: [
        { model: Usuario, as: 'nutricionista', attributes: ['id_usuario', 'nombre', 'apellidos'] },
      ],
    });

    return lista.map((ev) => ({
      id:                 String(ev.id_evaluacion),
      pacienteId:         String(ev.id_paciente),
      fecha:              ev.fecha_evaluacion,
      peso:               parseFloat(ev.peso_kg),
      talla:              parseFloat(ev.talla_cm),
      perimetroAbdominal: ev.perimetro_abdom_cm ? parseFloat(ev.perimetro_abdom_cm) : null,
      imc:                parseFloat(ev.imc),
      clasificacionImc:   ev.clasificacion_imc,
      indicaciones:       [ev.recomendaciones_ali, ev.recomendaciones_fis].filter(Boolean).join('\n\n'),
      recomendacionesAli: ev.recomendaciones_ali,
      recomendacionesFis: ev.recomendaciones_fis,
      fechaProximoCtrl:   ev.fecha_proximo_ctrl,
      editableHasta:      ev.editable_hasta,
      nutricionista:      ev.nutricionista
        ? `${ev.nutricionista.nombre} ${ev.nutricionista.apellidos}`
        : null,
    }));
  },

  async crear(datos, nutricionistaId, ip) {
    const paciente = await Paciente.findByPk(datos.id_paciente);
    if (!paciente) {
      const e = new Error('Paciente no encontrado.');
      e.status = 404;
      throw e;
    }

    const nueva = await Evaluacion.create({
      id_paciente:         datos.id_paciente,
      id_nutricionista:    nutricionistaId,
      fecha_evaluacion:    datos.fecha_evaluacion || new Date(),
      peso_kg:             datos.peso_kg,
      talla_cm:            datos.talla_cm,
      perimetro_abdom_cm:  datos.perimetro_abdom_cm || null,
      recomendaciones_ali: datos.recomendaciones_ali || null,
      recomendaciones_fis: datos.recomendaciones_fis || null,
      fecha_proximo_ctrl:  datos.fecha_proximo_ctrl || null,
    });

    await registrarAuditoria({
      id_usuario:   nutricionistaId,
      accion:       'CREATE',
      entidad:      'EVALUACION',
      id_entidad:   nueva.id_evaluacion,
      datos_nuevos: nueva.toJSON(),
      ip_origen:    ip,
    });

    return nueva;
  },
};

// ═══════════════════════════════════════════════
//  SERVICIO: DASHBOARD
// ═══════════════════════════════════════════════
const dashboardSrv = {
  async resumen() {
    const totalPacientes    = await Paciente.count();
    const totalEvaluaciones = await Evaluacion.count();

    // Evaluaciones del último mes
    const hace30 = new Date();
    hace30.setDate(hace30.getDate() - 30);
    const evaluacionesMes = await Evaluacion.count({
      where: { fecha_evaluacion: { [Op.gte]: hace30 } },
    });

    // Distribución por clasificación IMC
    const distribucion = await Evaluacion.findAll({
      attributes: [
        'clasificacion_imc',
        [sequelize.fn('COUNT', sequelize.col('id_evaluacion')), 'total'],
      ],
      group: ['clasificacion_imc'],
      raw:   true,
    });

    return {
      totalPacientes,
      totalEvaluaciones,
      evaluacionesMes,
      distribucionImc: distribucion.map((d) => ({
        clasificacion: d.clasificacion_imc,
        total:         parseInt(d.total, 10),
      })),
    };
  },
};

// ─────────────────────────────────────────────
//  Exportaciones
// ─────────────────────────────────────────────
module.exports = {
  pacientesSrv,
  evaluacionesSrv,
  dashboardSrv,
  utils: { calcularEdad, formatearFecha, registrarAuditoria },
};
