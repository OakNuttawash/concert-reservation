# Concert System

A full-stack application for concert management built with NestJS and Next.js.

## Project Structure

This project is a monorepo managed with Turborepo, containing:

- `apps/api`: NestJS backend application
- `apps/web`: Next.js frontend application

## Prerequisites

- Node.js (v18 or later)
- pnpm
- Docker

## Setup and Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the Docker containers:

```bash
pnpm compose:up
```

**Note:**

- Port 8080 for backend, 3000 for frontend, and 5432 for PostgreSQL.

## Running the Application

### Development Mode

Run all applications simultaneously:

```bash
pnpm dev
```

Or run applications individually:

Backend (API):

```bash
pnpm --filter api dev
```

Frontend (Web):

```bash
pnpm --filter web dev
```

## Testing

Run unit tests for backend

```bash
pnpm --filter api test
```

## Architecture Overview

```bash
+------------------------------------------+
|                Frontend                  |
|  +----------------------------------+    |
|  |            Next.js App           |    |
|  |  +------------+  +------------+  |    |
|  |  |   Admin    |  |   User     |  |    |
|  |  |            |  |            |  |    |
|  |  +------------+  +------------+  |    |
|  |         |            |           |    |
|  |  +----------------------------------+ |
|  |  |        API Integration          |  |
|  |  |        (openapi-fetch)          |  |
|  |  +----------------------------------+ |
+------------------------------------------+
                    |
                    | HTTP/REST
                    |
+------------------------------------------+
|                Backend                   |
|  +----------------------------------+    |
|  |           NestJS API            |     |
|  |  +----------------------------+ |     |
|  |  |          Concert           | |     |
|  |  |          Service           | |     |
|  |  +----------------------------+ |     |
|  |         |   Typeorm  |          |     |
|  |         |            |          |     |
|  |  +------------------------------+     |
|  |  |          PostgreSQL          |     |
|  |  |          Database            |     |
|  |  +------------------------------+     |
+------------------------------------------+
```

### Backend (NestJS)

The backend follows a modular architecture with structure:

- **Controllers**: Handle HTTP requests and define API endpoints
- **Services**: Contain all business logic
- **DTOs**: Define data transfer objects for validation
- **Entities**: Define database models

### Frontend (Next.js)

The frontend structure:

```bash
web/...
├── app/... --- App router
│ ├── (main)/... --- Main content group routes
│ │ ├── @admin/... --- Admin routes
│ │ ├── @user/... --- User routes
│ │ └── layout.tsx --- Conditional Layout component
│ └── layout.tsx --- Main Layout component
├── api/... --- Contain all api resource
├── components/ ... --- Reusable and Base UI components
└── lib/... --- Useful functions and utils
```

## Technology Stack

### Backend

- **NestJS**: Progressive Node.js framework
- **TypeScript**: Type-safe development
- **Typeorm**: ORM library
- **PostgreSQL**: Relational database
- **OpenAPI**: API documentation
- **Jest**: Testing framework
- **class-validator**: Input validation
- **class-transformer**: Object transformation

### Frontend

- **Next.js**: React framework
- **TypeScript**: Type-safe development
- **TailwindCSS**: CSS framework
- **shadcn-ui**: Base UI component library
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **openapi-typescript**: Generated types from OpenAPI schema
- **openapi-fetch**: API client
- **dayjs**: Date manipulation

### Bonus Task

● Express your opinion about how to optimize your website in case that this
website contains intensive data and when more people access, the lower speed
you get?

Ans: ถ้าหากเว็บไซต์มี load ที่สูงจากการจัดการข้อมูลที่เยอะกับผู้เข้าใช้งานพร้อมกันจำนวนมาก มองว่าต้องมีการทำ caching ในข้อมูลที่มีการใช้งานบ่อยๆและข้อมูลที่มีการประมวลผลเยอะๆเพราะจะทำให้การเข้าถึงข้อมูลมาแสดงผลได้รวดเร็วขึ้น และการใช้ indexing ในฐานข้อมูลเพื่อประสิทธิภาพในการดึงข้อมูลที่รวดเร็วขึ้น รวมไปถึงถ้ามีคนเข้าใช้งานเยอะอาจพิจารณาการใช้ load balancer ที่ช่วยกระจายการรับภาระของเซิร์ฟเวอร์ไม่ให้หนักเกินไป

● Express your opinion about how to handle when many users want to reserve the
ticket at the same time? We want to ensure that in the concerts there is no one
that needs to stand up during the show.

Ans: การป้องกันโดยไม่ให้เกิดการจองซ้ำหรือเกินจำนวนที่นั่ง อาจทำเป็นระบบ Queue เพื่อให้สามารถจัดลำดับผู้ใช้งานได้ไม่เกิดการจองซ้อนทับกัน และ Database ที่มีการรองรับการทำ Row Locking และ Transaction อย่าง PostgreSQL ที่ช่วยให้ผู้ใช้หลายคนแก้ไขฐานข้อมูลหลายคนได้พร้อมกันโดยไม่ส่งผลกระทบคนอื่น รวมไปถึงใช้ websocket ในการอัพเดตสถานะและจำนวนที่นั่งแบบ realtime ให้ผู้ใช้งานเห็นข้อมูลที่ล่าสุดที่สุด
