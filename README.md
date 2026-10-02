# UpTask · Backend

**Proyecto de curso y práctica · API de gestión de proyectos**

Backend de una aplicación MERN para organizar proyectos, tareas, integrantes y notas. Este repositorio forma parte de mi aprendizaje con Node.js y TypeScript.

**Interfaz complementaria:** [UpTask_Frontend](https://github.com/ian0000/UpTask_Frontend).

## Qué se practica

- API REST con Express y TypeScript.
- Persistencia en MongoDB mediante Mongoose.
- Autenticación con JWT, confirmación de cuenta y recuperación de contraseña.
- Validación de entradas y control de acceso a proyectos.
- Gestión de tareas, equipo y notas.
- Envío de correos mediante SMTP.

## Estructura

| Ruta | Contenido |
| --- | --- |
| [src/routes](src/routes/) | Rutas de autenticación y proyectos |
| [src/controllers](src/controllers/) | Operaciones de la API |
| [src/models](src/models/) | Modelos de MongoDB |
| [src/config](src/config/) | Conexión, CORS y correo |
| [src/server.ts](src/server.ts) | Configuración de Express |
| [src/index.ts](src/index.ts) | Inicio del servidor |

## Desarrollo local

Requiere Node.js, npm, MongoDB y un servicio SMTP de pruebas. No se fija una versión de Node en `package.json`.

```sh
npm ci
```

Crea un archivo `.env` en la raíz:

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión a MongoDB |
| `JWT_SECRET` | Secreto de firma de tokens |
| `FRONTEND_URL` | Origen permitido por CORS y base de los enlaces de correo |
| `PORT` | Puerto; por defecto 4000 |
| `SMTP_HOST`, `SMTP_PORT` | Servidor de correo |
| `SMTP_USER`, `SMTP_PASSWORD` | Credenciales de correo |

```sh
npm run dev
```

Rutas base: `/api/auth` y `/api/projects`. Para clientes sin cabecera Origin, el script `npm run dev:api` habilita el modo previsto por la configuración CORS.

## Comandos

| Comando | Acción |
| --- | --- |
| `npm run dev` | Desarrollo con recarga |
| `npm run dev:api` | Desarrollo permitiendo clientes sin Origin |
| `npm run build` | Compilar TypeScript a `dist/` |
| `npm start` | Ejecutar el build |

No hay scripts de lint ni pruebas automatizadas en este paquete. Es material de formación; no se presenta como un producto listo para producción.

## Autoría y contexto

Práctica de [Ian K.](https://github.com/ian0000) realizada durante su formación. Los proyectos personales se presentan por separado en el perfil.
