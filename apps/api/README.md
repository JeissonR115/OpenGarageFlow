# OpenGarageFlow API

API principal de OpenGarageFlow, construida con NestJS, Prisma y PostgreSQL para gestionar operaciones de un taller automotriz: clientes, vehículos, inventario, órdenes de trabajo, empleados y autenticación.

## Descripción

Esta aplicación expone la capa de negocio y acceso a datos del sistema. El backend está preparado para:

- servir endpoints REST versionados
- usar validación global con DTOs
- integrarse con Prisma para PostgreSQL
- documentar la API con Swagger
- mantener módulos funcionales separados por dominio

## Stack

- [NestJS](https://nestjs.com/) 11
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger OpenAPI
- Jest para pruebas

## Estructura del proyecto

```text
apps/api/
├── prisma/
│   ├── schema/
│   ├── generated/
│   ├── migrations/
│   └── seed/
├── src/
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── common/
│   ├── config/
│   ├── dto/
│   ├── modules/
│   │   ├── auth/
│   │   ├── core/
│   │   ├── crm/
│   │   └── system/
│   └── prisma/
├── test/
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## Requisitos

- Node.js 22+ o 24+
- pnpm
- Docker y Docker Compose
- PostgreSQL ejecutándose localmente

## Configuración inicial

Desde la raíz del monorepo:

```bash
pnpm install
```

Inicia la base de datos:

```bash
docker compose -f docker/compose.yml up -d
```

Asegúrate de configurar la variable de entorno `DATABASE_URL` para la API. La aplicación espera que el proyecto en [apps/api](.) tenga acceso a la base de datos PostgreSQL del entorno local.

## Ejecutar la API

Desde la raíz:

```bash
pnpm api:dev
```

O desde la carpeta de la app:

```bash
cd apps/api
pnpm run start:dev
```

La API se levanta con prefijo global y versionado URI. El arranque principal está en [src/main.ts](src/main.ts) y el módulo raíz en [src/app.module.ts](src/app.module.ts).

## Comandos útiles

```bash
# desde la raíz
pnpm api:dev
pnpm api:test
pnpm --dir apps/api run test:e2e
pnpm --dir apps/api run lint

# dentro de apps/api
pnpm run start
pnpm run start:dev
pnpm run build
pnpm run test
pnpm run test:watch
pnpm run test:cov
pnpm run test:e2e
```

## Convenciones del backend

### Módulos

- Cada feature debe seguir el patrón: módulo, servicio y controlador.
- Se prefieren carpetas bajo [src/modules](src/modules) con nombres de dominio como `auth`, `core`, `crm` y `system`.
- Si se requieren DTOs compartidos, se colocan en [src/dto](src/dto).

### Bootstrap y configuración

La aplicación usa:

- prefijo global
- versionado por URI
- CORS activo
- `ValidationPipe` con `whitelist`, `transform` y `forbidNonWhitelisted`
- Swagger habilitado cuando la configuración lo permite

Todo esto se configura en [src/main.ts](src/main.ts).

### Prisma

- Prisma es la capa de acceso a datos de la API.
- El esquema y migraciones viven en [prisma](prisma).
- No se debe saltar `PrismaService` para acceder a la base de datos desde servicios.
- Los cambios de esquema deben ir acompañados de migración y validación.

### Autenticación y contratos

- Los endpoints deben seguir el versionado y el prefijo global.
- Los inputs deben validarse con DTOs.
- Se deben devolver respuestas tipadas; evitar filtrar modelos de Prisma directamente en controladores.

## Testing

Se recomienda escribir pruebas unitarias focalizadas cuando se agrega lógica backend.

```bash
cd apps/api
pnpm run test
pnpm run test:e2e
```

Usar `@nestjs/testing` para pruebas de módulos y servicios; el e2e debe cubrir comportamiento de rutas y contratos HTTP.

## Swagger

Si está habilitado, la documentación OpenAPI queda disponible en la ruta configurada por la app, normalmente bajo el prefijo global y la ruta de docs.

## Archivos clave

- [src/app.module.ts](src/app.module.ts)
- [src/main.ts](src/main.ts)
- [src/config](src/config)
- [src/modules](src/modules)
- [prisma](prisma)
- [test](test)

## Notas importantes

- No asumir que los paquetes compartidos del monorepo ya tienen implementación; verificar antes de importarlos.
- El foco principal del trabajo debe estar en la API, salvo que la tarea explícitamente involucre frontend.
- Mantener cambios pequeños y alineados con la estructura actual del backend.

## Referencias

- [README.md](../../README.md)
- [AGENTS.md](../../AGENTS.md)
- [apps/web/README.md](../web/README.md)
