import unittest
from app import create_app
from app.models import db, Mechanic

class TestMechanics(unittest.TestCase):

    def setUp(self):
        self.app = create_app("TestingConfig")
        self.app.testing = True
        self.client = self.app.test_client()

        self.ctx = self.app.app_context()
        self.ctx.push()

        db.drop_all()
        db.create_all()

        self.mechanic = Mechanic(
            name="Mike",
            email="mike@example.com",
            phone="555-1111",
            password="pass123",
            salary=50000
        )
        db.session.add(self.mechanic)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    # CRUD TESTS
    def test_create_mechanic(self):
        payload = {
            "name": "Tech",
            "email": "tech@example.com",
            "phone": "555-2222",
            "password": "pass123",
            "salary": 60000
        }
        response = self.client.post("/mechanics/", json=payload)
        self.assertEqual(response.status_code, 201)

    def test_create_mechanic_duplicate_email(self):
        payload = {
            "name": "Dup",
            "email": "mike@example.com",
            "phone": "555-3333",
            "password": "pass123",
            "salary": 50000
        }
        response = self.client.post("/mechanics/", json=payload)
        self.assertEqual(response.status_code, 400)

    def test_get_mechanic_invalid(self):
        response = self.client.get("/mechanics/9999")
        self.assertEqual(response.status_code, 404)

    def test_update_mechanic_invalid_schema(self):
        payload = {"salary": "notanumber"}
        response = self.client.put(f"/mechanics/{self.mechanic.id}", json=payload)
        self.assertEqual(response.status_code, 400)

    def test_delete_mechanic_invalid(self):
        response = self.client.delete("/mechanics/9999")
        self.assertEqual(response.status_code, 404)
