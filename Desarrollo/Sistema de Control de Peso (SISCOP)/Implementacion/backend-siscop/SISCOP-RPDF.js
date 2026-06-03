// SISCOP – Sistema de Control de Pacientes Nutricionales
// Clínica San Fernando
// SISCOP-RPDF.js – Generación de reportes en PDF (PDFKit)
// Versión: 1.0 | Fecha: 21/05/2026

const PDFDocument = require('pdfkit');
const { Paciente, Evaluacion, Usuario } = require('./SISCOP-MOD');
const { utils } = require('./SISCOP-SRV');

// ─────────────────────────────────────────────
//  Helpers de diseño
// ─────────────────────────────────────────────
const COLOR_AZUL  = '#1A82C4';
const COLOR_VERDE = '#00C03A';
const COLOR_TEXTO = '#1F2937';

const cabecera = (doc, titulo) => {
  doc
    .fillColor(COLOR_AZUL)
    .fontSize(20)
    .text('SISCOP – Clínica San Fernando', { align: 'center' });
  doc
    .moveDown(0.2)
    .fontSize(12)
    .fillColor(COLOR_TEXTO)
    .text(titulo, { align: 'center' });
  doc
    .moveTo(50, doc.y + 8)
    .lineTo(545, doc.y + 8)
    .strokeColor(COLOR_VERDE)
    .lineWidth(1.5)
    .stroke();
  doc.moveDown(1.5);
};

const seccion = (doc, titulo) => {
  doc
    .fillColor(COLOR_AZUL)
    .fontSize(13)
    .text(titulo);
  doc.moveDown(0.3);
  doc.fillColor(COLOR_TEXTO).fontSize(11);
};

const par = (doc, label, valor) => {
  doc
    .font('Helvetica-Bold').text(`${label}: `, { continued: true })
    .font('Helvetica').text(valor != null && valor !== '' ? String(valor) : '—');
};

const piePagina = (doc) => {
  const fecha = new Date().toLocaleString('es-PE');
  doc
    .fontSize(9)
    .fillColor('#9CA3AF')
    .text(`Generado el ${fecha} | SISCOP v1.0`, 50, 770, { align: 'center', width: 495 });
};

// ─────────────────────────────────────────────
//  Stream PDF a la respuesta HTTP
// ─────────────────────────────────────────────
const enviarPDF = (res, nombreArchivo) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${nombreArchivo}"`);
  doc.pipe(res);
  return doc;
};

// ═════════════════════════════════════════════
//  Reporte: Historial Clínico
// ═════════════════════════════════════════════
const historialClinico = async (idPaciente, res) => {
  const paciente = await Paciente.findByPk(idPaciente, {
    include: [{ model: Evaluacion, as: 'evaluaciones' }],
  });
  if (!paciente) {
    return res.status(404).json({ ok: false, mensaje: 'Paciente no encontrado.' });
  }

  const evaluaciones = await Evaluacion.findAll({
    where:   { id_paciente: idPaciente },
    order:   [['fecha_evaluacion', 'DESC']],
    include: [{ model: Usuario, as: 'nutricionista', attributes: ['nombre', 'apellidos'] }],
  });

  const doc = enviarPDF(res, `historial-paciente-${idPaciente}.pdf`);

  cabecera(doc, 'Reporte de Historial Clínico');

  // Datos del paciente
  seccion(doc, 'Datos del Paciente');
  par(doc, 'Nombres',          paciente.nombres);
  par(doc, 'Apellidos',        paciente.apellidos);
  par(doc, 'Documento',        `${paciente.tipo_documento} ${paciente.dni}`);
  par(doc, 'Sexo',             paciente.sexo === 'F' ? 'Femenino' : 'Masculino');
  par(doc, 'Edad',             utils.calcularEdad(paciente.fecha_nacimiento));
  par(doc, 'Teléfono',         paciente.telefono);
  par(doc, 'Fecha nacimiento', paciente.fecha_nacimiento);
  doc.moveDown(1);

  // Lista de evaluaciones
  seccion(doc, `Evaluaciones registradas (${evaluaciones.length})`);

  if (evaluaciones.length === 0) {
    doc.text('El paciente aún no cuenta con evaluaciones registradas.');
  } else {
    evaluaciones.forEach((ev, idx) => {
      doc.moveDown(0.5);
      doc
        .font('Helvetica-Bold').fillColor(COLOR_AZUL)
        .text(`${idx + 1}. Evaluación del ${new Date(ev.fecha_evaluacion).toLocaleDateString('es-PE')}`);
      doc.fillColor(COLOR_TEXTO).font('Helvetica');
      par(doc, 'Peso',                `${ev.peso_kg} kg`);
      par(doc, 'Talla',               `${ev.talla_cm} cm`);
      par(doc, 'Perímetro abdominal', ev.perimetro_abdom_cm ? `${ev.perimetro_abdom_cm} cm` : '—');
      par(doc, 'IMC',                 `${ev.imc} (${ev.clasificacion_imc})`);
      if (ev.nutricionista) {
        par(doc, 'Nutricionista', `${ev.nutricionista.nombre} ${ev.nutricionista.apellidos}`);
      }
      if (ev.recomendaciones_ali) par(doc, 'Recom. alimentarias', ev.recomendaciones_ali);
      if (ev.recomendaciones_fis) par(doc, 'Recom. físicas',      ev.recomendaciones_fis);
    });
  }

  piePagina(doc);
  doc.end();
};

// ═════════════════════════════════════════════
//  Reporte: Evaluación individual
// ═════════════════════════════════════════════
const evaluacion = async (idEvaluacion, res) => {
  const ev = await Evaluacion.findByPk(idEvaluacion, {
    include: [
      { model: Paciente, as: 'paciente' },
      { model: Usuario,  as: 'nutricionista', attributes: ['nombre', 'apellidos'] },
    ],
  });
  if (!ev) {
    return res.status(404).json({ ok: false, mensaje: 'Evaluación no encontrada.' });
  }

  const doc = enviarPDF(res, `evaluacion-${idEvaluacion}.pdf`);

  cabecera(doc, 'Reporte de Evaluación Nutricional');

  seccion(doc, 'Paciente');
  par(doc, 'Nombres y apellidos', `${ev.paciente.nombres} ${ev.paciente.apellidos}`);
  par(doc, 'Documento',           `${ev.paciente.tipo_documento} ${ev.paciente.dni}`);
  par(doc, 'Edad',                utils.calcularEdad(ev.paciente.fecha_nacimiento));
  doc.moveDown(0.8);

  seccion(doc, 'Resultados de la Evaluación');
  par(doc, 'Fecha',               new Date(ev.fecha_evaluacion).toLocaleString('es-PE'));
  par(doc, 'Peso',                `${ev.peso_kg} kg`);
  par(doc, 'Talla',               `${ev.talla_cm} cm`);
  par(doc, 'Perímetro abdominal', ev.perimetro_abdom_cm ? `${ev.perimetro_abdom_cm} cm` : '—');
  par(doc, 'IMC',                 `${ev.imc}`);
  par(doc, 'Clasificación',       ev.clasificacion_imc);
  if (ev.fecha_proximo_ctrl) par(doc, 'Próximo control', ev.fecha_proximo_ctrl);
  doc.moveDown(0.8);

  if (ev.recomendaciones_ali || ev.recomendaciones_fis) {
    seccion(doc, 'Recomendaciones');
    if (ev.recomendaciones_ali) {
      doc.font('Helvetica-Bold').text('Alimentarias:').font('Helvetica').text(ev.recomendaciones_ali);
      doc.moveDown(0.3);
    }
    if (ev.recomendaciones_fis) {
      doc.font('Helvetica-Bold').text('Físicas:').font('Helvetica').text(ev.recomendaciones_fis);
    }
  }

  if (ev.nutricionista) {
    doc.moveDown(1);
    doc
      .font('Helvetica-Oblique')
      .fillColor('#6B7280')
      .text(`Atendido por: ${ev.nutricionista.nombre} ${ev.nutricionista.apellidos}`, { align: 'right' });
  }

  piePagina(doc);
  doc.end();
};

module.exports = {
  historialClinico,
  evaluacion,
};
