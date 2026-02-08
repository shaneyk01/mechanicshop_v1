# Mechanic Shop API

A robust, RESTful API built with Flask for managing a mechanic shop's daily operations. This system handles customers, mechanics, vehicle inventory, and service tickets, providing a solid backend infrastructure for business management.

## 🏗 Architecture & Implementation

The project follows a **modular, scalable architecture** using the **Application Factory pattern**. This ensures that the application is easily testable and extensible.

### Key Architectural Concepts:
*   **Blueprints**: The application is divided into distinct modules (Blueprints) for `customers`, `mechanics`, `service_tickets`, and `inventory`. This separates concerns and keeps the codebase organized.
*   **MVC Pattern (Model-View-Controller)**: 
    *   **Models** (`app/models.py`): SQLAlchemy ORM models representing the database schema.
    *   **Views/Routes** (`app/blueprints/*/routes.py`): Handle HTTP requests and responses.
    *   **Controllers** (Logic): Business logic is embedded within route handlers and utility functions.
*   **Serialization**: `Marshmallow` schemas are used to validate input data and serialize database objects into JSON responses.
*   **Documentation First**: API endpoints are documented using **Swagger/OpenAPI 2.0**, available via an interactive UI.

### Tech Stack:
*   **Framework**: Flask
*   **Database**: SQLite (Development) / SQLAlchemy ORM
*   **Serialization**: Flask-Marshmallow
*   **Rate Limiting**: Flask-Limiter
*   **Caching**: Flask-Caching
*   **Documentation**: Swagger (Flask-Swagger-UI)
*   **Testing**: Unittest

---

## 📂 Project Structure

```bash
mechanicshop_v1/
├── app/
│   ├── __init__.py           # Application Factory
│   ├── models.py             # Database Models
│   ├── extension.py          # Extensions (DB, MA, Limiter, Cache)
│   ├── static/
│   │   └── swagger.yaml      # API Definitions
│   └── blueprints/           # Feature Modules
│       ├── customers/
│       ├── mechanics/
│       ├── service_tickets/
│       └── inventory/
├── test/                     # Unit Tests
├── config.py                 # Configuration settings
├── flask_app.py              # Application Entry Point
├── requirement.txt           # Dependencies
└── README.md                 # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
*   Python 3.10+
*   Pip
*   Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/shaneyk01/mechanicshop_v1.git
    cd mechanicshop_v1
    ```

2.  **Create and Activate Virtual Environment**
    ```bash
    # Mac/Linux
    python3 -m venv .venv
    source .venv/bin/activate

    # Windows
    python -m venv .venv
    .venv\Scripts\activate
    ```

3.  **Install Dependencies**
    ```bash
    pip install -r requirement.txt
    ```

4.  **Configuration**
    *   The app uses different configurations in `config.py` (DevelopmentConfig, TestingConfig, ProductionConfig).
    *   Set the `FLASK_APP` environment variable:
        ```bash
        export FLASK_APP=flask_app.py
        # or on Windows: set FLASK_APP=flask_app.py
        ```

---

## 🏃‍♂️ Running the Application

Start the development server:

```bash
python flask_app.py
```
*The server will start at `http://127.0.0.1:5000`*

### Accessing API Documentation
Once the server is running, visit:
👉 **[http://127.0.0.1:5000/api/docs](http://127.0.0.1:5000/api/docs)**

This provides an interactive Swagger UI to test endpoint requests directly.

---

## 🧪 Testing

This project uses `unittest` for automated testing.

**Run all tests:**
```bash
python -m unittest discover -s test -p "test_*.py" -v
```

**Run specific test file:**
```bash
python -m unittest test.test_customer
```

---

## 🔄 CI/CD Workflows

A GitHub Actions workflow (`.github/workflows/main.yaml`) is set up to ensure code quality.

*   **Trigger**: Pushes and Pull Requests to `main`.
*   **Action**: Sets up Python, installs dependencies, and runs the unittest suite automatically.

---

## 📝 API Endpoints Overview

| Blueprint | Route | Description |
|-----------|-------|-------------|
| **Customers** | `POST /customers` | Register a new customer |
| | `POST /customers/login` | Authenticate customer |
| | `GET /customers` | List all customers |
| **Mechanics** | `POST /mechanics` | Register a mechanic |
| | `GET /mechanics/popular` | Get popular mechanics |
| **Tickets** | `POST /service-tickets` | Create a service ticket |
| | `GET /service-tickets/{id}` | Get ticket details |
| **Inventory** | `POST /inventory` | Add item to inventory |

*(See Swagger UI for full details on parameters and responses)*
