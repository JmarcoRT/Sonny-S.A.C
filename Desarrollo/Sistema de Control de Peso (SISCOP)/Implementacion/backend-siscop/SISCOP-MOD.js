// SISCOP – Sistema de Control de Pacientes Nutricionales
// Clínica San Fernando
// SISCOP-MOD.js – Modelos del Sistema (Sequelize ORM)
// Versión: 1.0 | Fecha: 21/05/2026

const { DataTypes } = require('sequelize');
const { sequelize }  = require('./SISCOP-CBD');

// ═══════════════════════════════════════════════════════════════
//  MODELO: USUARIO
// ═══════════════════════════════════════════════════════════════
const Usuario = sequelize.define(
  'USUARIO',
  {
    id_usuario: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true,
    },
    nombre: {
      type:      DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre no puede estar vacío.' },
        len:      { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres.' },
      },
    },
    apellidos: {
      type:      DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Los apellidos no pueden estar vacíos.' },
        len:      { args: [2, 100], msg: 'Los apellidos deben tener entre 2 y 100 caracteres.' },
      },
    },
    email: {
      type:      DataTypes.STRING(150),
      allowNull: false,
      unique:    { msg: 'El correo electrónico ya está registrado en el sistema.' },
      validate: {
        isEmail: { msg: 'Debe proporcionar un correo electrónico válido.' },
      },
    },
    password_hash: {
      type:      DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type:      DataTypes.ENUM('recepcionista', 'nutricionista'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['recepcionista', 'nutricionista']],
          msg:  'El rol debe ser "recepcionista" o "nutricionista".',
        },
      },
    },
    usuario: {
      type:      DataTypes.STRING(50),
      allowNull: false,
      unique:    { msg: 'El nombre de usuario ya está registrado en el sistema.' },
      validate: {
        notEmpty: { msg: 'El nombre de usuario no puede estar vacío.' },
        len:      { args: [3, 50], msg: 'El usuario debe tener entre 3 y 50 caracteres.' },
      },
    },
    activo: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: true,
    },
  },
  {
    tableName:  'USUARIO',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  'updated_at',
  }
);

// ═══════════════════════════════════════════════════════════════
//  MODELO: PACIENTE
// ═══════════════════════════════════════════════════════════════
const Paciente = sequelize.define(
  'PACIENTE',
  {
    id_paciente: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true,
    },
    nombres: {
      type:      DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Los nombres del paciente no pueden estar vacíos.' },
        len:      { args: [2, 100], msg: 'Los nombres deben tener entre 2 y 100 caracteres.' },
      },
    },
    apellidos: {
      type:      DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Los apellidos del paciente no pueden estar vacíos.' },
        len:      { args: [2, 100], msg: 'Los apellidos deben tener entre 2 y 100 caracteres.' },
      },
    },
    dni: {
      type:      DataTypes.STRING(20),
      allowNull: false,
      unique:    { msg: 'El DNI ya existe en el sistema.' },
      validate: {
        notEmpty: { msg: 'El DNI no puede estar vacío.' },
      },
    },
    tipo_documento: {
      type:         DataTypes.ENUM('DNI', 'Carnet de Extranjería'),
      allowNull:    false,
      defaultValue: 'DNI',
    },
    telefono: {
      type:      DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^\+?\d{9,15}$/,
          msg:  'Ingrese un número de teléfono válido (9 a 15 dígitos).',
        },
      },
    },
    sexo: {
      type:      DataTypes.ENUM('M', 'F'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['M', 'F']],
          msg:  'El sexo debe ser "M" (masculino) o "F" (femenino).',
        },
      },
    },
    fecha_nacimiento: {
      type:      DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate:  { msg: 'La fecha de nacimiento debe ser una fecha válida.' },
        isBefore: {
          args: new Date().toISOString().split('T')[0],
          msg:  'La fecha de nacimiento debe ser anterior a la fecha actual.',
        },
      },
    },
    // created_by se define como FK en la sección de asociaciones
  },
  {
    tableName:  'PACIENTE',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  'updated_at',
  }
);

// ═══════════════════════════════════════════════════════════════
//  MODELO: EVALUACION
// ═══════════════════════════════════════════════════════════════
const Evaluacion = sequelize.define(
  'EVALUACION',
  {
    id_evaluacion: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true,
    },
    // id_paciente e id_nutricionista se definen en asociaciones
    fecha_evaluacion: {
      type:         DataTypes.DATE,
      allowNull:    false,
      defaultValue: DataTypes.NOW,
    },
    peso_kg: {
      type:      DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'El peso debe ser un número decimal válido.' },
        min:       { args: [1], msg: 'El peso debe ser mayor a 0 kg.' },
        max:       { args: [500], msg: 'El peso ingresado excede el valor máximo permitido.' },
      },
    },
    talla_cm: {
      type:      DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'La talla debe ser un número decimal válido.' },
        min:       { args: [50],  msg: 'La talla debe ser mayor a 50 cm.' },
        max:       { args: [250], msg: 'La talla ingresada excede el valor máximo permitido.' },
      },
    },
    perimetro_abdom_cm: {
      type:      DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        isDecimal: { msg: 'El perímetro abdominal debe ser un número decimal válido.' },
        min:       { args: [1],   msg: 'El perímetro abdominal debe ser mayor a 0 cm.' },
        max:       { args: [300], msg: 'El perímetro abdominal excede el valor máximo permitido.' },
      },
    },
    imc: {
      type:      DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment:   'Calculado automáticamente: peso_kg / (talla_cm / 100)²',
    },
    clasificacion_imc: {
      type:      DataTypes.STRING(30),
      allowNull: false,
      comment:   'Bajo peso | Normal | Sobrepeso | Obesidad (clasificación OMS)',
    },
    recomendaciones_ali: {
      type:    DataTypes.TEXT,
      allowNull: true,
    },
    recomendaciones_fis: {
      type:    DataTypes.TEXT,
      allowNull: true,
    },
    fecha_proximo_ctrl: {
      type:    DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: { msg: 'La fecha del próximo control debe ser una fecha válida.' },
      },
    },
    editable_hasta: {
      type:      DataTypes.DATE,
      allowNull: false,
      comment:   'fecha_evaluacion + 24 horas. Transcurrido este plazo el registro queda bloqueado.',
    },
  },
  {
    tableName:  'EVALUACION',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  false,

    hooks: {
      // Calcula el IMC y su clasificación antes de crear o actualizar
      beforeValidate: (evaluacion) => {
        if (evaluacion.peso_kg && evaluacion.talla_cm) {
          const talla_m = parseFloat(evaluacion.talla_cm) / 100;
          const imc     = parseFloat(evaluacion.peso_kg) / (talla_m * talla_m);
          evaluacion.imc = parseFloat(imc.toFixed(2));

          if      (imc < 18.5)  evaluacion.clasificacion_imc = 'Bajo peso';
          else if (imc < 25.0)  evaluacion.clasificacion_imc = 'Normal';
          else if (imc < 30.0)  evaluacion.clasificacion_imc = 'Sobrepeso';
          else                  evaluacion.clasificacion_imc = 'Obesidad';
        }

        // Establece el límite de edición (24 horas desde la evaluación)
        if (!evaluacion.editable_hasta && evaluacion.fecha_evaluacion) {
          const limite = new Date(evaluacion.fecha_evaluacion);
          limite.setHours(limite.getHours() + 24);
          evaluacion.editable_hasta = limite;
        }
      },
    },
  }
);

// ═══════════════════════════════════════════════════════════════
//  MODELO: AUDITORIA
// ═══════════════════════════════════════════════════════════════
const Auditoria = sequelize.define(
  'AUDITORIA',
  {
    id_auditoria: {
      type:          DataTypes.INTEGER,
      primaryKey:    true,
      autoIncrement: true,
    },
    // id_usuario se define en asociaciones
    accion: {
      type:      DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: {
          args: [['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']],
          msg:  'Acción de auditoría no reconocida.',
        },
      },
      comment: 'CREATE | UPDATE | DELETE | LOGIN | LOGOUT',
    },
    entidad: {
      type:      DataTypes.STRING(50),
      allowNull: false,
      comment:   'Nombre de la tabla afectada (PACIENTE, EVALUACION, USUARIO, etc.)',
    },
    id_entidad: {
      type:    DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID del registro afectado',
    },
    datos_previos: {
      type:    DataTypes.JSONB,
      allowNull: true,
      comment: 'Estado anterior del registro (solo para UPDATE y DELETE)',
    },
    datos_nuevos: {
      type:    DataTypes.JSONB,
      allowNull: true,
      comment: 'Estado nuevo del registro (solo para CREATE y UPDATE)',
    },
    ip_origen: {
      type:    DataTypes.INET,
      allowNull: true,
    },
  },
  {
    tableName:  'AUDITORIA',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  false,
  }
);

// ═══════════════════════════════════════════════════════════════
//  ASOCIACIONES (Relaciones entre entidades)
// ═══════════════════════════════════════════════════════════════

// USUARIO ──< EVALUACION  (nutricionista realiza muchas evaluaciones)
Usuario.hasMany(Evaluacion, {
  foreignKey: { name: 'id_nutricionista', allowNull: false },
  as:         'evaluaciones_realizadas',
});
Evaluacion.belongsTo(Usuario, {
  foreignKey: { name: 'id_nutricionista', allowNull: false },
  as:         'nutricionista',
});

// PACIENTE ──< EVALUACION  (un paciente tiene muchas evaluaciones)
Paciente.hasMany(Evaluacion, {
  foreignKey: { name: 'id_paciente', allowNull: false },
  as:         'evaluaciones',
  onDelete:   'RESTRICT',
});
Evaluacion.belongsTo(Paciente, {
  foreignKey: { name: 'id_paciente', allowNull: false },
  as:         'paciente',
});

// USUARIO ──< PACIENTE  (administrador registra al paciente)
Usuario.hasMany(Paciente, {
  foreignKey: { name: 'created_by', allowNull: false },
  as:         'pacientes_registrados',
});
Paciente.belongsTo(Usuario, {
  foreignKey: { name: 'created_by', allowNull: false },
  as:         'registrado_por',
});

// USUARIO ──< AUDITORIA  (cada acción auditada está asociada a un usuario)
Usuario.hasMany(Auditoria, {
  foreignKey: { name: 'id_usuario', allowNull: false },
  as:         'acciones_auditadas',
});
Auditoria.belongsTo(Usuario, {
  foreignKey: { name: 'id_usuario', allowNull: false },
  as:         'usuario',
});

// ═══════════════════════════════════════════════════════════════
//  ÍNDICES (Rendimiento – según DAP sección 4.3.4)
// ═══════════════════════════════════════════════════════════════
// Los índices se crean mediante migraciones Sequelize en producción.
// En desarrollo (sync) Sequelize los añade si se declaran en el modelo.

Paciente.addIndex    = () => {}; // placeholder – gestionar con migraciones

/*
  Índices documentados en SISCOP-DAP:
    idx_paciente_dni          → PACIENTE(dni)
    idx_evaluacion_paciente   → EVALUACION(id_paciente)
    idx_evaluacion_fecha      → EVALUACION(fecha_evaluacion)
    idx_auditoria_usuario     → AUDITORIA(id_usuario)
    idx_auditoria_fecha       → AUDITORIA(created_at)
*/

// ═══════════════════════════════════════════════════════════════
//  EXPORTACIONES
// ═══════════════════════════════════════════════════════════════
module.exports = {
  Usuario,
  Paciente,
  Evaluacion,
  Auditoria,
};
