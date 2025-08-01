# NestJS Backend API

A modular, role-based backend API built with **NestJS** and **PostgreSQL**.  
Implements authentication, authorization, route protection, and request throttling with clean architecture.

---

## Features

- **Authentication**
  - JWT-based login and registration
  - Secure password hashing (bcrypt)
  - Access & refresh token strategy

- **Authorization**
  - Role-based access control (User & Admin)
  - Guards for route protection by role
  - Admin-only routes (e.g., delete resources)

- **Posts Module**
  - Users can create, update, and view posts
  - Admins can delete posts

- **Security**
  - AuthGuard + RoleGuard implementation
  - Rate limiting to prevent abuse

- **Database**
  - PostgreSQL integration
  - Modular services with repositories

---

##  Tech Stack

| Category       | Tool/Library        |
|----------------|---------------------|
| Framework      | NestJS              |
| Database       | PostgreSQL          |
| ORM / Querying | TypeORM     |
| Auth           | JWT, bcrypt         |
| Security       | Guards, RateLimiter |
| Config         | @nestjs/config      |

---

