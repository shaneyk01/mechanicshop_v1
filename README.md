# Mechanic Shop API

A Flask-based REST API for managing a mechanic shop with customers, mechanics, and service tickets.

## Overview

This application provides endpoints to manage:
- **Customers**: Create and manage customer information
- **Mechanics**: Create and manage mechanic profiles with salary information
- **Service Tickets**: Create service requests, assign mechanics, and track repairs



## Setup Instructions

### Prerequisites
- Python 3.11+
- MySQL Server
- pip (Python package manager)

### 1. Create Virtual Environment

```bash
python -m venv .venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
.\.venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Database

Update the database connection in `config.py`:

```python
class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI='mysql+mysqlconnector://root:YOUR_PASSWORD@localhost/mechanic_shop_v1'
    DEBUG = True
```

Replace `YOUR_PASSWORD` with your MySQL root password.

### 5. Create Database

```sql
CREATE DATABASE mechanic_shop_v1;
```

### 6. Run Application

```bash
python main.py
```

The server will start at `http://127.0.0.1:5000`

## API Endpoints

### Customers

#### Create Customer
```
POST /customers/
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "password": "password123"
}
```

#### Get All Customers
```
GET /customers/
```

#### Get Customer by ID
```
GET /customers/{customer_id}
```

#### Delete Customer
```
DELETE /customers/{customer_id}
```

---

### Mechanics

#### Create Mechanic
```
POST /mechanics/
```
**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "555-5678",
  "password": "password123",
  "salary": 50000
}
```

#### Get All Mechanics
```
GET /mechanics/
```

#### Get Mechanic by ID
```
GET /mechanics/{mechanic_id}
```

#### Delete Mechanic
```
DELETE /mechanics/{mechanic_id}
```

---

### Service Tickets

#### Create Service Ticket
```
POST /service_tickets/
```
**Request Body:**
```json
{
  "customer_id": 1,
  "mechanic_id": 1,
  "Date": "2025-12-27T10:30:00",
  "service_description": "Oil change and filter replacement"
}
```

#### Get All Service Tickets
```
GET /service_tickets/
```

#### Get Service Ticket by ID
```
GET /service_tickets/{ticket_id}
```

#### Delete Service Ticket
```
DELETE /service_tickets/{ticket_id}
```

#### Add Mechanic to Service Ticket
```
PUT /service_tickets/{ticket_id}/add mechanic/{mechanic_id}
```

#### Remove Mechanic from Service Ticket
```
PUT /service_tickets/{ticket_id}/remove mechanic/{mechanic_id}
```

---

## Database Models

### Customer
- `id` (int, primary key)
- `name` (string, required)
- `email` (string, unique, required)
- `phone` (string, unique, required)
- `password` (string, required)
- `service_tickets` (relationship to ServiceTicket)

### Mechanic
- `id` (int, primary key)
- `name` (string, required)
- `email` (string, unique, required)
- `phone` (string, unique, required)
- `password` (string, required)
- `salary` (int, required)
- `service_tickets` (many-to-many relationship)

### ServiceTicket
- `id` (int, primary key)
- `customer_id` (int, foreign key, required)
- `mechanic_id` (int, foreign key, required)
- `Date` (datetime, required)
- `service_description` (string, max 1000 chars, required)
- `customers` (relationship to Customer)
- `mechanics` (many-to-many relationship)

---

## Technologies Used

- **Flask** - Web framework
- **Flask-SQLAlchemy** - ORM for database interactions
- **Marshmallow** - Data serialization/deserialization
- **MySQL** - Database
- **mysql-connector-python** - MySQL driver

## Configuration

The application uses environment-based configuration in `config.py`:

- `DevelopmentConfig` - Development environment settings
- Debug mode enabled by default
- SQLAlchemy database URI configured for MySQL

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `404` - Not Found
- `500` - Server Error

Error responses include descriptive messages to help with debugging.

## Development Notes

- The application uses Flask blueprints for modular structure
- Marshmallow schemas handle request validation and response serialization
- SQLAlchemy handles all database operations
- Foreign key constraints are enforced at the database level
- The many-to-many relationship between mechanics and service tickets is handled through the `ticket_mechanic` association table

## Future Improvements

- Authentication and authorization
- Request rate limiting
- Comprehensive logging
- Unit and integration tests
- API documentation with Swagger/OpenAPI
- Pagination for large result sets
- Search and filtering capabilities
- Transaction management for complex operations

## Support

For issues or questions, please refer to the Flask and SQLAlchemy documentation.
