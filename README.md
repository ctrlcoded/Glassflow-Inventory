# GlassFlow — Inventory & Order Management System

A full-stack, production-ready Inventory & Order Management System with a glassmorphism UI, built with React, FastAPI, PostgreSQL, and Docker.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

---

## Features

### Product Management
- Create, read, update, and delete products
- Unique SKU enforcement
- Real-time stock quantity tracking with low-stock alerts

### Customer Management
- Create, view, and delete customers
- Unique email validation
- Customer directory with search

### Order Management
- Create orders with multiple line items
- Automatic total calculation by the backend
- Inventory deduction on order placement
- Stock restoration on order cancellation
- Order detail view with line items

### Dashboard
- Summary cards (Total Products, Customers, Orders, Low Stock)
- Recent orders table
- Low stock alert table

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Vite, Axios, Lucide Icons |
| Backend | Python, FastAPI, SQLAlchemy ORM, Pydantic |
| Database | PostgreSQL 15 |
| Infrastructure | Docker, Docker Compose |

---

## Project Structure

```
GlassFlow/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── products.py    # Product CRUD endpoints
│   │   │   │   ├── customers.py   # Customer CRUD endpoints
│   │   │   │   └── orders.py      # Order CRUD endpoints
│   │   │   └── api_router.py      # Route aggregator
│   │   ├── crud.py                # Database operations & business logic
│   │   ├── database.py            # DB connection & session
│   │   ├── models.py              # SQLAlchemy models
│   │   ├── schemas.py             # Pydantic validation schemas
│   │   └── main.py                # FastAPI app entry point
│   ├── Dockerfile
│   ├── .dockerignore
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Dashboard, Products, Customers, Orders
│   │   ├── api.js                 # Axios instance
│   │   ├── App.jsx                # Router setup
│   │   └── main.jsx               # Entry point
│   ├── Dockerfile
│   ├── .dockerignore
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## Quick Start

### Prerequisites
- [Docker Desktop](https://docs.docker.com/desktop/) installed and running

### Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd GlassFlow

# 2. Copy environment variables
cp .env.example .env

# 3. Build and start all services
docker compose up --build -d

# 4. (Optional) Seed the database with sample data
docker compose exec backend python seed.py
```

### Access

| Service | URL |
|---|---|
| Frontend | [http://localhost](http://localhost) |
| Backend API Docs | [http://localhost:8000/docs](http://localhost:8000/docs) |
| Health Check | [http://localhost:8000/health](http://localhost:8000/health) |

---

## API Reference

### Products
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products` | Create a product |
| GET | `/api/products` | List all products |
| GET | `/api/products/{id}` | Get product by ID |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |

### Customers
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/customers` | Create a customer |
| GET | `/api/customers` | List all customers |
| GET | `/api/customers/{id}` | Get customer by ID |
| DELETE | `/api/customers/{id}` | Delete a customer |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create an order |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/{id}` | Get order by ID |
| DELETE | `/api/orders/{id}` | Cancel an order |

---

## Business Logic

- **Unique SKU**: Product SKU codes are enforced unique at both API and database level
- **Unique Email**: Customer emails are enforced unique at both API and database level
- **Non-negative Stock**: Product quantity cannot go below zero (DB CHECK constraint + Pydantic validation)
- **Inventory Check**: Orders are rejected if requested quantity exceeds available stock
- **Auto Deduction**: Placing an order automatically reduces product stock
- **Auto Calculation**: Order total is computed server-side from item prices × quantities
- **Stock Restoration**: Cancelling an order restores the deducted inventory

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_USER` | `postgres` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `postgres` | PostgreSQL password |
| `POSTGRES_DB` | `glassflow` | Database name |
| `DATABASE_URL` | (auto-composed) | Full connection string |

---

## Stopping the Application

```bash
docker compose down        # Stop containers
docker compose down -v     # Stop and remove data volumes
```
