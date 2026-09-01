# Roadmap

This document describes the planned evolution of OpenGarageFlow.
The roadmap is subject to change as the project evolves.

---

## Current status

The project is in the early implementation phase. The monorepo structure, NestJS API app, Prisma setup, Docker environment, and initial backend module scaffolding are already in place. The main focus now is completing the base domain model and the authentication/authorization foundation before moving into workshop workflows.

### Already in place

- [x] Monorepo setup
- [x] Docker development environment
- [x] PostgreSQL integration
- [x] Prisma schema and migration structure
- [x] NestJS API bootstrap and app configuration
- [x] Global validation, versioning, CORS, and Swagger setup
- [x] Initial module scaffolding: `auth`, `core`, `crm`, `system`
- [x] Documentation structure and agent guidance

### Pending foundation work

- [ ] Complete JWT auth flow
- [ ] Finish role and permission model
- [ ] Connect domain modules to Prisma models consistently
- [ ] Define and enforce API response conventions
- [ ] Add CI and lint/test quality gates
- [ ] Finish API documentation coverage

---

## Version 0.1.0 — Foundation

The first milestone focuses on establishing the project architecture, backend conventions, and working infrastructure.

### Goals

- [x] Initialize the project structure
- [x] Configure the development environment
- [x] Define the database model
- [-] Implement authentication
- [-] Build the first application modules

### Planned work

- [x] Monorepo and workspace configuration
- [x] Docker development environment
- [x] PostgreSQL integration
- [x] Prisma ORM
- [-] Authentication (JWT)
- [-] Authorization (RBAC): roles module in progress
- [ ] API documentation
      \=======
- [x] Prisma ORM setup
- [ ] Authentication (JWT)
- [ ] Authorization (RBAC)
- [ ] API documentation coverage

> > > > > > > Stashed changes

- [ ] CI configuration

---

## Version 0.2.0 — Core Business

The second milestone introduces the core business entities required to operate a workshop platform.

### Modules

- [x] Companies
- [ ] Branches
- [-] Employees
- [-] Roles and user-role assignments
- [-] Users
- [ ] Customers
- [ ] Vehicles
- [ ] Services
- [ ] Products

---

## Version 0.3.0 — Workshop Operations

This release focuses on the day-to-day workflow inside a workshop.

### Modules

- [ ] Work Orders
- [ ] Work Order Assignments
- [ ] Work Order Status
- [ ] Payments
- [ ] Dashboard

---

## Version 0.4.0 — Inventory

Inventory management becomes part of the platform.

### Modules

- [ ] Suppliers
- [ ] Inventory
- [ ] Stock Movements
- [ ] Purchase Orders

---

## Version 0.5.0 — Reports

Introduce analytical and operational reporting capabilities.

### Modules

- [ ] Operational Reports
- [ ] Sales Reports
- [ ] Inventory Reports

---

## Future Releases

The following features are planned but are not part of the current roadmap.

- [ ] Appointment Scheduling
- [ ] Warranty Management
- [ ] Notifications
- [ ] File Attachments
- [ ] QR Tracking
- [ ] Vehicle Inspection
- [ ] Multi-language Support
- [ ] Public API
- [ ] Mobile Application
- [ ] Cloud Edition
- [ ] AI-assisted Features

---

## MVP Scope

The first public version aims to deliver the following functionality:

- [-] Authentication
- [ ] Customer Management
- [ ] Vehicle Management
- [ ] Work Orders
- [ ] Basic Inventory
- [ ] Dashboard

The objective is to build a stable and functional foundation before introducing advanced features.

---

## Status

| Version | Status      |
| ------- | ----------- |
| 0.1.0   | In Progress |
| 0.2.0   | Planned     |
| 0.3.0   | Planned     |
| 0.4.0   | Planned     |
| 0.5.0   | Planned     |

## Recommended next milestone

1. Complete the auth and RBAC foundation.
2. Model the central domain entities: users, employees, customers, vehicles, and branches.
3. Implement the first CRUD set under the API modules and connect them to Prisma.
4. Validate the flow with tests and Swagger examples before adding workshop operations.
