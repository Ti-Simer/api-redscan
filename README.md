# RedScan Backend API

## Descripción General

**RedScan Backend API** es el servidor backend del proyecto **AEGIS** desarrollado por **SIMER ELECTRONIC S.A.S.** Este backend proporciona los servicios necesarios para la aplicación móvil RedScan, la cual facilita el registro, ubicación y consulta de medidores de gas domiciliario mediante el escaneo de códigos QR o de barras.

La API está construida con **NestJS** y **TypeScript**, utilizando **MySQL** como base de datos y **TypeORM** como ORM.

## Características Principales

- ✅ **Gestión de Usuarios**: Sistema de autenticación y autorización con roles y permisos
- ✅ **Gestión de Localidades**: CRUD completo para manejo de ubicaciones geográficas
- ✅ **Gestión de Códigos de Barras**: Registro y consulta de medidores escaneados
- ✅ **Sistema de Roles y Permisos**: Control granular de acceso
- ✅ **Autenticación JWT**: Tokens seguros para sesiones de usuario
- ✅ **API Key Protection**: Protección adicional para endpoints sensibles
- ✅ **Georeferenciación**: Soporte para coordenadas GPS
- ✅ **Búsqueda Avanzada**: Búsqueda por palabras clave en múltiples campos
- ✅ **Rate Limiting**: Protección contra abuso de la API

## Tecnologías Utilizadas

- **Framework**: NestJS 10.x
- **Lenguaje**: TypeScript 5.x
- **Base de Datos**: MySQL
- **ORM**: TypeORM 0.3.x
- **Autenticación**: JWT + bcryptjs
- **Validación**: Class Validator
- **Documentación**: Swagger (opcional)

## Estructura del Proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── auth.service.ts      # Servicios de autenticación
│   ├── auth.module.ts       # Configuración del módulo
│   └── api-key.middleware.ts # Middleware de API Key
├── users/                   # Gestión de usuarios
│   ├── entities/
│   │   └── users.entity.ts  # Entidad Usuario
│   ├── users.service.ts     # Servicios de usuario
│   ├── users.controller.ts  # Controlador de usuarios
│   └── users.module.ts      # Configuración del módulo
├── roles/                   # Sistema de roles
│   ├── entities/
│   │   └── roles.entity.ts  # Entidad Rol
│   └── ...
├── permissions/             # Sistema de permisos
│   ├── entities/
│   │   └── permission.entity.ts # Entidad Permiso
│   └── ...
├── locations/               # Gestión de localidades
│   ├── entities/
│   │   └── location.entity.ts # Entidad Localidad
│   └── ...
├── barcodes/               # Gestión de códigos
│   ├── entities/
│   │   └── barcode.entity.ts # Entidad Código
│   └── ...
├── utils/                  # Utilidades
│   ├── response.util.ts    # Utilidad para respuestas
│   └── auth.middleware.ts  # Middleware de autenticación
└── main.ts                 # Punto de entrada de la aplicación
```

## Instalación y Configuración

### Prerrequisitos

- **Node.js** (versión 18.x o superior)
- **MySQL** (versión 8.x o superior)
- **npm** o **yarn**

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd api-redscan
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   - Crear una base de datos MySQL llamada `redscan_montagas`
   - Actualizar las credenciales en `src/app.module.ts`:
   ```typescript
   TypeOrmModule.forRoot({
     type: 'mysql',
     host: '127.0.0.1',
     port: 3306,
     username: 'root',        // Cambiar por tu usuario
     password: '123',         // Cambiar por tu contraseña
     database: 'redscan_montagas',
     entities: [__dirname + '/**/*.entity{.ts,.js}'],
     synchronize: true,       // Solo para desarrollo
   })
   ```

4. **Ejecutar la aplicación**

   **Desarrollo:**
   ```bash
   npm run start:dev
   ```

   **Producción:**
   ```bash
   npm run build
   npm run start:prod
   ```

La aplicación estará disponible en: `http://localhost:4009`

## Configuración de Variables de Entorno

Se recomienda crear un archivo `.env` para las variables de entorno:

```env
# Base de datos
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=123
DB_DATABASE=redscan_montagas

# JWT
JWT_SECRET=poseidon

# API Key
API_KEY=qGV4EwEW-bB8g0K9D-3KMJbJsK-n1qT4Umm

# Puerto de la aplicación
PORT=4009
```

## API Endpoints

### Autenticación

- `GET /auth/initial-permissions` - Crear permisos, roles y usuario inicial

### Usuarios

- `GET /users/all` - Obtener todos los usuarios
- `POST /users/create` - Crear un nuevo usuario
- `POST /users/login` - Iniciar sesión
- `GET /users/getById/:id` - Obtener usuario por ID
- `PUT /users/update/:id` - Actualizar usuario
- `DELETE /users/delete/:id` - Eliminar usuario
- `POST /users/createMultiple` - Crear múltiples usuarios

### Roles

- `GET /roles/all` - Obtener todos los roles
- `POST /roles/create` - Crear un nuevo rol
- `GET /roles/getById/:id` - Obtener rol por ID
- `PUT /roles/update/:id` - Actualizar rol
- `DELETE /roles/:id` - Eliminar rol

### Permisos

- `GET /permissions/all` - Obtener todos los permisos
- `POST /permissions/create` - Crear un nuevo permiso
- `GET /permissions/getById/:id` - Obtener permiso por ID
- `PUT /permissions/update/:id` - Actualizar permiso
- `DELETE /permissions/:id` - Eliminar permiso

### Localidades

- `GET /locations/all` - Obtener todas las localidades
- `POST /locations/create` - Crear una nueva localidad
- `PUT /locations/update/:id` - Actualizar localidad

### Códigos de Barras

- `POST /barcodes/create` - Crear un nuevo código
- `POST /barcodes/createMultiple` - Crear múltiples códigos
- `POST /barcodes/all` - Obtener códigos con paginación
- `POST /barcodes/findByQuery` - Buscar códigos por palabra clave

## Seguridad

### Autenticación por API Key

Todos los endpoints (excepto login) requieren el header:
```
mgo: qGV4EwEW-bB8g0K9D-3KMJbJsK-n1qT4Umm
```

### JWT Tokens

Los usuarios autenticados reciben un token JWT válido por 1 hora.

### Rate Limiting

La API tiene limitación de velocidad configurada:
- **15 solicitudes por minuto** por IP

## Base de Datos

### Entidades Principales

1. **Users**: Información de usuarios del sistema
2. **Roles**: Roles de usuario con permisos asociados
3. **Permissions**: Permisos granulares del sistema
4. **Locations**: Localidades geográficas para organizar medidores
5. **Barcodes**: Códigos escaneados con información del medidor

### Usuario por Defecto

Al iniciar la aplicación se crea automáticamente:
- **Email**: `adminuser@admin.com`
- **Contraseña**: `6ebS#r&#^B6n`
- **Rol**: Administrador General

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev        # Inicia en modo desarrollo con hot reload
npm run start:debug      # Inicia en modo debug

# Producción
npm run build           # Compila el proyecto
npm run start:prod      # Inicia en modo producción

# Testing
npm run test           # Ejecuta tests unitarios
npm run test:watch     # Tests en modo watch
npm run test:cov       # Tests con coverage
npm run test:e2e       # Tests end-to-end

# Utilidades
npm run lint           # Ejecuta ESLint
npm run format         # Formatea código con Prettier
```

## Integración con la App Móvil

Esta API está diseñada para trabajar con la aplicación móvil **RedScan** que permite:

1. **Escaneo de códigos QR/Barras** de medidores de gas
2. **Registro de ubicación GPS** automático
3. **Gestión de localidades** operativas
4. **Búsqueda y consulta** de medidores registrados
5. **Integración con Google Maps** para navegación

## CORS

La API está configurada para aceptar solicitudes desde cualquier origen (`*`). En producción se recomienda restringir esto a dominios específicos.

## Logging

La aplicación incluye logging detallado para:
- Intentos de login exitosos y fallidos
- Operaciones de base de datos
- Errores del sistema

## Contacto y Soporte

**SIMER ELECTRONIC S.A.S.**
- **Email**: contacto@simerelectronics.com
- **Teléfono**: +57 3137507352

## Licencia

Este proyecto es privado y está desarrollado exclusivamente para SIMER ELECTRONIC S.A.S. bajo el proyecto AEGIS.

---

## Notas para Desarrolladores

### Próximas Mejoras Recomendadas

1. **Variables de Entorno**: Migrar configuración hardcodeada a variables de entorno
2. **Validación de Datos**: Implementar DTOs con class-validator
3. **Documentación API**: Integrar Swagger para documentación automática
4. **Tests**: Implementar tests unitarios y de integración
5. **Logs Estructurados**: Implementar un sistema de logging más robusto
6. **Backup Automático**: Sistema de respaldo de base de datos
7. **Monitoreo**: Implementar métricas y alertas

### Estructura de Respuesta Estándar

Todas las respuestas siguen el formato:
```json
{
  "statusCode": 200,
  "message": "Descripción del resultado",
  "data": {} // Datos de la respuesta
}
```

Para errores:
```json
{
  "statusCode": 400,
  "message": "Descripción del error",
  "data": null
}
```
