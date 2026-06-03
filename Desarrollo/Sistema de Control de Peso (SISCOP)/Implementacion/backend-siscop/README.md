# SISCOP – Backend

Backend Express + Sequelize del Sistema de Control de Pacientes Nutricionales de la Clínica San Fernando.

## Estructura

| Archivo            | Responsabilidad                              |
| ------------------ | -------------------------------------------- |
| `SISCOP-CBD.js`    | Conexión a PostgreSQL (Sequelize).           |
| `SISCOP-MOD.js`    | Modelos: Usuario, Paciente, Evaluación, Auditoría. |
| `SISCOP-SRV.js`    | Servicios / lógica de negocio.               |
| `SISCOP-API.js`    | Endpoints REST (Express Router).             |
| `SISCOP-AUTH.js`   | Autenticación JWT + bcrypt.                  |
| `SISCOP-VBACK.js`  | Validaciones de entrada (express-validator). |
| `SISCOP-RPDF.js`   | Generación de reportes en PDF (PDFKit).      |
| `server.js`        | Punto de entrada HTTP.                       |
| `seed.js`          | Siembra de usuarios y pacientes de prueba.   |
| `.env`             | Credenciales de BD y configuración.          |

## Instalación

```bash
cd backend-siscop
npm install
```

## Inicializar base de datos

Las tablas SISCOP se crean automáticamente al arrancar `seed.js`.

```bash
# Conservar tablas existentes y agregar lo que falte:
npm run seed

# Recrear desde cero (DROP + CREATE de tablas SISCOP):
npm run seed:reset
```

`seed:reset` borra **solo** las tablas SISCOP (`USUARIO`, `PACIENTE`, `EVALUACION`, `AUDITORIA`). El resto de la BD queda intacto.

## Levantar el servidor

```bash
npm run dev    # con nodemon
npm start      # producción
```

Por defecto: `http://localhost:3000/api`

## Usuarios de prueba

Contraseña en todos: `siscop123`

| Usuario | Rol            | Email                       |
| ------- | -------------- | --------------------------- |
| nutri   | Nutricionista  | c.silva@hospital.gob.pe     |
| lucia   | Nutricionista  | l.mendoza@hospital.gob.pe   |
| recep   | Recepcionista  | r.vargas@hospital.gob.pe    |
| maria   | Recepcionista  | m.gomez@hospital.gob.pe     |

## Endpoints principales

| Método | Ruta                                       | Auth | Rol           |
| ------ | ------------------------------------------ | ---- | ------------- |
| POST   | `/api/auth/login`                          | —    | —             |
| GET    | `/api/auth/me`                             | JWT  | cualquiera    |
| GET    | `/api/pacientes`                           | JWT  | cualquiera    |
| GET    | `/api/pacientes/:id`                       | JWT  | cualquiera    |
| POST   | `/api/pacientes`                           | JWT  | Recepcionista |
| PUT    | `/api/pacientes/:id`                       | JWT  | Recepcionista |
| GET    | `/api/pacientes/:id/evaluaciones`          | JWT  | cualquiera    |
| POST   | `/api/evaluaciones`                        | JWT  | Nutricionista |
| GET    | `/api/dashboard`                           | JWT  | cualquiera    |
| GET    | `/api/pacientes/:id/reporte/historial`     | JWT  | cualquiera    |
| GET    | `/api/evaluaciones/:id/reporte`            | JWT  | cualquiera    |
