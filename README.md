# Mechanic Shop API v1

A RESTful API for managing a mechanic shop's operations, including customers, mechanics, and service tickets. Built with Flask and SQLAlchemy, this application provides a complete backend solution for automotive service management.

## Features

- **Customer Management**: Create, read, update, and delete customer records
- **Mechanic Management**: Manage mechanic profiles and information
- **Service Ticket System**: Track service requests with customer-mechanic assignments
- **MySQL Database Integration**: Persistent data storage with SQLAlchemy ORM
- **RESTful API Design**: Clean and intuitive API endpoints
- **Data Validation**: Schema validation using Marshmallow
- **Postman Collection**: Pre-configured API testing collection included

## Technology Stack

- **Framework**: Flask 3.1.2
- **Database ORM**: SQLAlchemy 2.0.45
- **Database**: MySQL (with mysql-connector-python 9.5.0)
- **Serialization**: Marshmallow 4.1.1 & Flask-Marshmallow 1.3.0
- **Python Version**: Python 3.x

### Key Dependencies

- Flask-SQLAlchemy 3.1.1
- marshmallow-sqlalchemy 1.4.2
- Flask-Caching 2.3.1
- Flask-Limiter 4.1.1
- PyYAML 6.0.3

## Prerequisites

Before running this application, ensure you have the following installed:

- Python 3.x
- MySQL Server
- pip (Python package manager)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shaneyk01/mechanicshop_v1.git
   cd mechanicshop_v1
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up MySQL Database**
   - Create a MySQL database named `mechanic_shop_v1`
   - Update the database credentials in `config.py` if needed

## Configuration

Update the database connection string in `config.py`:

```python
class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI='mysql+mysqlconnector://username:password@localhost/mechanic_shop_v1'
    DEBUG = True
```

Replace `username` and `password` with your MySQL credentials.

## Running the Application

1. **Start the Flask application**
   ```bash
   python main.py
   ```

2. The API will be available at `http://127.0.0.1:5000`

The application will automatically create all necessary database tables on first run.

## API Endpoints

### Customers

- **POST** `/customers` - Create a new customer
- **GET** `/customers` - Get all customers
- **GET** `/customers/<customer_id>` - Get a specific customer
- **PUT** `/customers/<customer_id>` - Update a customer
- **DELETE** `/customers/<customer_id>` - Delete a customer

#### Example Request Body (Create Customer):
```json
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "8081234567",
    "password": "securepassword"
}
```

### Mechanics

- **POST** `/mechanics` - Create a new mechanic
- **GET** `/mechanics` - Get all mechanics
- **GET** `/mechanics/<mechanic_id>` - Get a specific mechanic
- **PUT** `/mechanics/<mechanic_id>` - Update a mechanic
- **DELETE** `/mechanics/<mechanic_id>` - Delete a mechanic

#### Example Request Body (Create Mechanic):
```json
{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "8089876543",
    "password": "securepassword",
    "salary": 50000
}
```

### Service Tickets

- **POST** `/service_tickets` - Create a new service ticket
- **GET** `/service_tickets` - Get all service tickets
- **GET** `/service_tickets/<ticket_id>` - Get a specific service ticket
- **PUT** `/service_tickets/<ticket_id>` - Update a service ticket
- **DELETE** `/service_tickets/<ticket_id>` - Delete a service ticket

#### Example Request Body (Create Service Ticket):
```json
{
    "customer_id": 1,
    "mechanic_id": 1,
    "Date": "2024-01-15T10:00:00",
    "service_description": "Oil change and tire rotation"
}
```

## Database Schema

### Tables

1. **customers**
   - `id` (Primary Key)
   - `name` (String, required)
   - `email` (String, unique, required)
   - `phone` (String, unique, required)
   - `password` (String, required)

2. **mechanics**
   - `id` (Primary Key)
   - `name` (String, required)
   - `email` (String, unique, required)
   - `phone` (String, unique, required)
   - `password` (String, required)
   - `salary` (Integer, required)

3. **service_tickets**
   - `id` (Primary Key)
   - `customer_id` (Foreign Key → customers.id)
   - `mechanic_id` (Foreign Key → mechanics.id)
   - `Date` (DateTime, required)
   - `service_description` (String, required)

4. **ticket_mechanic** (Association Table)
   - Many-to-many relationship between service_tickets and mechanics

## Project Structure

```
mechanicshop_v1/
├── app/
│   ├── __init__.py              # Flask app factory
│   ├── models.py                # Database models
│   ├── extension.py             # Flask extensions
│   └── blueprints/
│       ├── customers/           # Customer endpoints
│       │   ├── __init__.py
│       │   ├── routes.py
│       │   └── schemas.py
│       ├── mechanics/           # Mechanic endpoints
│       │   ├── __init__.py
│       │   ├── routes.py
│       │   └── schemas.py
│       └── service_tickets/     # Service ticket endpoints
│           ├── __init__.py
│           ├── routes.py
│           └── schemas.py
├── config.py                    # Configuration settings
├── main.py                      # Application entry point
├── requirements.txt             # Python dependencies
├── mechanic_shop_v1.postman_collection.json  # Postman API tests
└── README.md                    # This file
```

## Testing with Postman

A Postman collection is included in the repository (`mechanic_shop_v1.postman_collection.json`). Import this file into Postman to test all API endpoints.

## Development

The application runs in debug mode by default during development. The server will automatically reload when you make changes to the code.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is available for educational and personal use.

## Author

Shaney Kalilikane

## Support

For issues or questions, please open an issue in the GitHub repository.
