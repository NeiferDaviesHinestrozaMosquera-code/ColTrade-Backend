# 🚢 ColTrade Backend - Sistema de Gestión de Comercio Exterior

![ColTrade Banner](https://raw.githubusercontent.com/NeiferDaviesHinestrozaMosquera-code/ColTrade-Backend/main/dist/assets/banner.png) <!-- Nota: Se sugiere subir una imagen de banner similar a la seleccionada -->

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**ColTrade-Backend** es una infraestructura robusta y escalable diseñada para centralizar y optimizar las operaciones de comercio exterior. Construido con **NestJS** y **Prisma**, este backend proporciona una API potente para la gestión de importaciones, exportaciones, logística y cumplimiento normativo.

---

## 🚀 Características Principales

| Módulo | Descripción |
| :--- | :--- |
| **Multi-Tenant** | Soporte para múltiples empresas con planes de suscripción (Free, Pro, Pymes, Empresarial). |
| **Gestión de Operaciones** | Seguimiento detallado de importaciones y exportaciones en tiempo real. |
| **Logística Integrada** | Control de estados de envío, BL, códigos Nandina y destinos internacionales. |
| **Sistema de Soporte** | Gestión de tickets con prioridades y estados para atención al cliente. |
| **Academia ColTrade** | Módulos y lecciones integradas para capacitación en comercio exterior. |
| **Seguridad Avanzada** | Autenticación basada en JWT con roles definidos (Admin, Operator, Viewer). |

---

## 🛠️ Stack Tecnológico

- **Framework:** [NestJS](https://nestjs.com/) - Framework progresivo de Node.js.
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) - Tipado estático para mayor robustez.
- **ORM:** [Prisma](https://www.prisma.io/) - Modelado de datos y consultas simplificadas.
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) (vía [Supabase](https://supabase.com/)).
- **Herramientas:** ESLint, Prettier, Jest para pruebas unitarias y E2E.

---

## 📂 Estructura del Proyecto

```text
src/
├── common/         # Decoradores, filtros y utilidades compartidas
├── config/         # Configuraciones globales y variables de entorno
├── modules/        # Módulos funcionales de la aplicación
│   ├── auth/       # Lógica de autenticación y seguridad
│   └── operations/ # Gestión de importaciones/exportaciones
├── prisma/         # Cliente de Prisma y servicios de BD
└── supabase/       # Integración con servicios de Supabase
```

---

## ⚙️ Configuración e Instalación

### Requisitos Previos
- Node.js (v18 o superior)
- NPM o PNPM
- Instancia de PostgreSQL (o proyecto en Supabase)

### Instalación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/NeiferDaviesHinestrozaMosquera-code/ColTrade-Backend.git
   cd ColTrade-Backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   Crea un archivo `.env` basado en `.env.example`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/coltrade"
   JWT_SECRET="tu_secreto_super_seguro"
   ```

4. Ejecutar migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```

---

## 🏃 Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

---

## 🧪 Pruebas

El proyecto incluye una suite completa de pruebas para garantizar la estabilidad:

```bash
# Pruebas unitarias
npm run test

# Pruebas E2E
npm run test:e2e

# Cobertura de código
npm run test:cov
```

---

## 📊 Diagrama de Base de Datos

El sistema utiliza un esquema relacional complejo gestionado por Prisma. A continuación se detallan las entidades principales:

- **Tenants:** Empresas registradas en la plataforma.
- **Users:** Personal administrativo y operativo.
- **Operations:** El núcleo del negocio (Import/Export).
- **Documents:** Archivos adjuntos y certificados.
- **Support:** Tickets y comunicación de ayuda.

---

## 🤝 Contribuciones

1. Haz un **Fork** del proyecto.
2. Crea una nueva rama (`git checkout -b feature/NuevaFuncionalidad`).
3. Realiza tus cambios y haz **Commit** (`git commit -m 'Añadir nueva funcionalidad'`).
4. Sube los cambios a tu rama (`git push origin feature/NuevaFuncionalidad`).
5. Abre un **Pull Request**.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  Desarrollado con ❤️ por <a href="https://github.com/NeiferDaviesHinestrozaMosquera-code">Neifer Davies Hinestroza Mosquera</a>
</p>
