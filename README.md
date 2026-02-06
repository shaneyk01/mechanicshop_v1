# Mechanic Shop API

A Flask-based REST API for managing a mechanic shop with customers, mechanics, and service tickets.

## Overview

2. Activate Virtual Environment
Windows:

bash
.\.venv\Scripts\Activate.ps1
Linux/Mac:

bash
source .venv/bin/activate
3. Install Dependencies
bash
pip install -r requirements.txt
For development (testing / linting / formatting), consider adding a requirements-dev.txt and installing:

bash
pip install -r requirements-dev.txt
# Example dev deps:
# pytest pytest-cov flake8 black isort
4. Configure Database
Update the database connection in config.py:

Python
class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI='mysql+mysqlconnector://root:YOUR_PASSWORD@localhost/mechanic_shop_v1'
    DEBUG = True
Replace YOUR_PASSWORD with your MySQL root password.

5. Create Database
SQL
CREATE DATABASE mechanic_shop_v1;
6. Run Application
bash
python main.py
The server will start at http://127.0.0.1:5000

API Endpoints
Customers
Create Customer
Code
POST /customers/
Request Body:

JSON
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "password": "password123"
}
Get All Customers
Code
GET /customers/
Get Customer by ID
Code
GET /customers/{customer_id}
Delete Customer
Code
DELETE /customers/{customer_id}
Mechanics
Create Mechanic
Code
POST /mechanics/
Request Body:

JSON
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "555-5678",
  "password": "password123",
  "salary": 50000
}
Get All Mechanics
Code
GET /mechanics/
Get Mechanic by ID
Code
GET /mechanics/{mechanic_id}
Delete Mechanic
Code
DELETE /mechanics/{mechanic_id}
Service Tickets
Create Service Ticket
Code
POST /service_tickets/
Request Body:

JSON
{
  "customer_id": 1,
  "mechanic_id": 1,
  "Date": "2025-12-27T10:30:00",
  "service_description": "Oil change and filter replacement"
}
Get All Service Tickets
Code
GET /service_tickets/
Get Service Ticket by ID
Code
GET /service_tickets/{ticket_id}
Delete Service Ticket
Code
DELETE /service_tickets/{ticket_id}
Add Mechanic to Service Ticket
Code
PUT /service_tickets/{ticket_id}/add_mechanic/{mechanic_id}
Remove Mechanic from Service Ticket
Code
PUT /service_tickets/{ticket_id}/remove_mechanic/{mechanic_id}
Update Service Ticket (Edit)
Code
PUT /service_tickets/{ticket_id}
Request Body:

JSON
{
  "add_mechanic_ids": [2, 3],
  "remove_mechanic_ids": [1],
  "add_item": [1, 2]
}
Description: Bulk update to add/remove mechanics and associate inventory items with a service ticket.

Inventory
Create Inventory Item
Code
POST /inventory/
Request Body:

JSON
{
  "name": "Oil Filter",
  "price": 15.99
}
Get All Inventory Items
Code
GET /inventory/
Get Inventory Item by ID
Code
GET /inventory/{item_id}
Update Inventory Item
Code
PUT /inventory/{item_id}
Request Body:

JSON
{
  "name": "Premium Oil Filter",
  "price": 19.99
}
Delete Inventory Item
Code
DELETE /inventory/{item_id}
Database Models
Customer
id (int, primary key)
name (string, required)
email (string, unique, required)
phone (string, unique, required)
password (string, required)
service_tickets (relationship to ServiceTicket)
Mechanic
id (int, primary key)
name (string, required)
email (string, unique, required)
phone (string, unique, required)
password (string, required)
salary (int, required)
service_tickets (many-to-many relationship)
ServiceTicket
id (int, primary key)
customer_id (int, foreign key, required)
mechanic_id (int, foreign key, required)
Date (datetime, required)
service_description (string, max 1000 chars, required)
customers (relationship to Customer)
mechanics (many-to-many relationship)
items (many-to-many relationship to Inventory)
Inventory
id (int, primary key)
name (string, required)
price (float, required)
service_tickets (many-to-many relationship to ServiceTicket)
Technologies Used
Flask - Web framework
Flask-SQLAlchemy - ORM for database interactions
Marshmallow - Data serialization/deserialization
Flask-Limiter - Rate limiting for API endpoints
Flask-Caching - Response caching for improved performance
MySQL - Database
mysql-connector-python - MySQL driver
Configuration
The application uses environment-based configuration in config.py:

DevelopmentConfig - Development environment settings
Debug mode enabled by default
SQLAlchemy database URI configured for MySQL
Error Handling
The API returns appropriate HTTP status codes:

200 - Success
201 - Created
400 - Bad Request / Validation Error
404 - Not Found
500 - Server Error
Error responses include descriptive messages to help with debugging.

Testing
A testing suite is essential to ensure API correctness. The project currently does not include a full test suite; below are recommended conventions and commands to add and run tests.

Recommended Test Tools
pytest
pytest-cov (coverage)
requests (for integration tests)
factory_boy or pytest fixtures for test data
Install test tools:

bash
pip install pytest pytest-cov requests
# or with dev requirements
pip install -r requirements-dev.txt
Test Configuration
Use a separate testing database (e.g., mechanic_shop_v1_test) or SQLite in-memory for unit tests.
Keep tests in a tests/ directory.
Use fixtures to create app/test client and test data.
Example file structure:

Code
.
├── app/
├── tests/
│   ├── conftest.py       # pytest fixtures (app, client, db, sample data)
│   ├── test_customers.py
│   ├── test_mechanics.py
│   └── test_service_tickets.py
Example conftest.py skeleton:

Python
import pytest
from main import create_app, db as _db
from config import TestingConfig

@pytest.fixture(scope='session')
def app():
    app = create_app(TestingConfig)
    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()

@pytest.fixture(scope='function')
def client(app):
    return app.test_client()
Running Tests
Run all tests with coverage:

bash
pytest --maxfail=1 --disable-warnings -q
# with coverage
pytest --cov=app --cov-report=term-missing
Run a single test module:

bash
pytest tests/test_customers.py -q
CI Integration (GitHub Actions) example (create .github/workflows/pytest.yml):

YAML
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest pytest-cov
      - name: Run tests
        run: pytest --cov=app --cov-report=xml
      - name: Upload coverage artifact
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage.xml
API Documentation (Swagger / OpenAPI)
Providing interactive API docs is highly recommended. Below are two simple ways to add Swagger/OpenAPI documentation to this Flask app.

Option A — Flasgger (lightweight, quick to add)

Install:
bash
pip install flasgger
Initialize in your app (e.g., in main.py or app/__init__.py):
Python
from flasgger import Swagger

app = Flask(__name__)
Swagger(app)
Add YAML/Swagger docs in your route docstrings:
Python
@app.route('/customers/', methods=['POST'])
def create_customer():
    """
    Create a new customer
    ---
    tags:
      - Customers
    parameters:
      - in: body
        name: body
        schema:
          id: Customer
          required:
            - name
            - email
          properties:
            name:
              type: string
            email:
              type: string
    responses:
      201:
        description: Customer created
    """
    ...
Start the app and visit the interactive UI, typically at:
http://127.0.0.1:5000/apidocs/
Option B — Flask-RESTX (structured API with namespaces and built-in Swagger UI)

Install:
bash
pip install flask-restx
Initialize:
Python
from flask import Flask
from flask_restx import Api

app = Flask(__name__)
api = Api(app, version='1.0', title='Mechanic Shop API', description='API for managing mechanic shop')
# use api.namespace(...) to organize endpoints
Swagger UI is available at:
http://127.0.0.1:5000/ (or /swagger/ depending on configuration)
Flask-RESTX allows you to define models and automatically documents request/response schemas.
General notes:

Both options will generate an OpenAPI/Swagger JSON (commonly at /swagger.json or /openapi.json), which can be used with external Swagger UI or tools.
Choose Flasgger if you want to incrementally annotate existing routes with docstrings.
Choose Flask-RESTX if you want a more structured approach with namespaces, models, and automatic validation.
Development Notes
The application uses Flask blueprints for modular structure
Marshmallow schemas handle request validation and response serialization
SQLAlchemy handles all database operations
Foreign key constraints are enforced at the database level
The many-to-many relationship between mechanics and service tickets is handled through the ticket_mechanic association table
The many-to-many relationship between service tickets and inventory items is handled through the ticket_item association table
Rate limiting is implemented to prevent API abuse
Caching is configured to improve response times for frequently accessed data
Future Improvements
Authentication and authorization
Request rate limiting
Comprehensive logging
Unit and integration tests (see Testing section)
API documentation with Swagger/OpenAPI (see API Documentation section)
Pagination for large result sets
Search and filtering capabilities
Transaction management for complex operations
Support
For issues or questions, please refer to the Flask and SQLAlchemy docu