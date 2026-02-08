import unittest
from datetime import datetime, timedelta, timezone
from app import create_app
from app.models import db, Customer, ServiceTicket
from app.utils.auth import encode_customer_token

class TestCustomers(unittest.TestCase):

    def setUp(self):
        self.app = create_app("TestingConfig")
        self.app.testing = True
        self.client = self.app.test_client()

        self.ctx = self.app.app_context()
        self.ctx.push()

        db.drop_all()
        db.create_all()

        # Create a default customer
        self.customer = Customer(
            name="John Doe",
            email="john@example.com",
            phone="555-1111",
            password="pass123"
        )
        db.session.add(self.customer)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    # -------------------------
    # CRUD TESTS
    # -------------------------

    def test_create_customer(self):
        payload = {
            "name": "Alice",
            "email": "alice@example.com",
            "phone": "555-2222",
            "password": "pass123"
        }
        response = self.client.post("/customers/", json=payload)
        self.assertEqual(response.status_code, 201)

    def test_create_customer_duplicate_email(self):
        payload = {
            "name": "Duplicate",
            "email": "john@example.com",
            "phone": "555-3333",
            "password": "pass123"
        }
        response = self.client.post("/customers/", json=payload)
        self.assertEqual(response.status_code, 400)

    def test_get_customers(self):
        response = self.client.get("/customers/")
        self.assertEqual(response.status_code, 200)

    def test_get_customer_by_id_invalid(self):
        response = self.client.get("/customers/9999")
        self.assertEqual(response.status_code, 404)

    def test_delete_customer_invalid(self):
        response = self.client.delete("/customers/9999")
        self.assertEqual(response.status_code, 404)

    # -------------------------
    # TOKEN NEGATIVE TESTS
    # -------------------------

    def test_update_customer_missing_token(self):
        payload = {"name": "New Name"}
        response = self.client.put(f"/customers/{self.customer.id}", json=payload)
        self.assertEqual(response.status_code, 401)

    def test_update_customer_invalid_token(self):
        headers = {"Authorization": "Bearer invalidtoken123"}
        payload = {"name": "New Name"}
        response = self.client.put(f"/customers/{self.customer.id}", json=payload, headers=headers)
        self.assertEqual(response.status_code, 401)

    def test_update_customer_expired_token(self):
        expired_payload = {
            "exp": datetime.now(timezone.utc) - timedelta(hours=1),
            "iat": datetime.now(timezone.utc) - timedelta(days=1),
            "sub": str(self.customer.id)
        }
        import jose.jwt
        expired_token = jose.jwt.encode(expired_payload, "Super secret secrets", algorithm="HS256")

        headers = {"Authorization": f"Bearer {expired_token}"}
        payload = {"name": "New Name"}

        response = self.client.put(f"/customers/{self.customer.id}", json=payload, headers=headers)
        self.assertEqual(response.status_code, 401)

    def test_get_customer_tickets_missing_token(self):
        response = self.client.get("/customers/service-tickets")
        self.assertEqual(response.status_code, 401)
