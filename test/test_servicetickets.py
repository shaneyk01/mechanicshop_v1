import unittest
from datetime import datetime
from app import create_app
from app.models import db, ServiceTicket, Mechanic, Inventory, Customer

class TestServiceTickets(unittest.TestCase):

    def setUp(self):
        self.app = create_app("TestingConfig")
        self.app.testing = True
        self.client = self.app.test_client()

        self.ctx = self.app.app_context()
        self.ctx.push()

        db.drop_all()
        db.create_all()

        self.customer = Customer(
            name="John",
            email="john@example.com",
            phone="555-1111",
            password="pass123"
        )
        self.mechanic = Mechanic(
            name="Mike",
            email="mike@example.com",
            phone="555-2222",
            password="pass123",
            salary=50000
        )
        db.session.add_all([self.customer, self.mechanic])
        db.session.commit()

        self.ticket = ServiceTicket(
            customer_id=self.customer.id,
            mechanic_id=self.mechanic.id,
            Date=datetime.utcnow(),
            service_description="Inspection"
        )
        db.session.add(self.ticket)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    # NEGATIVE TESTS
    def test_create_ticket_missing_field(self):
        payload = {
            "customer_id": self.customer.id,
            "mechanic_id": self.mechanic.id
        }
        response = self.client.post("/service-tickets/", json=payload)
        self.assertEqual(response.status_code, 404)

    def test_get_ticket_invalid(self):
        response = self.client.get("/service-tickets/9999")
        self.assertEqual(response.status_code, 404)

    def test_delete_ticket_invalid(self):
        response = self.client.delete("/service-tickets/9999")
        self.assertEqual(response.status_code, 404)

    def test_add_mechanic_invalid(self):
        response = self.client.put("/service-tickets/9999/add_mechanic/1")
        self.assertEqual(response.status_code, 404)

    def test_remove_mechanic_invalid(self):
        response = self.client.put("/service-tickets/9999/remove_mechanic/1")
        self.assertEqual(response.status_code, 404)

    def test_edit_ticket_invalid_schema(self):
        payload = {"add_mechanic_ids": "notalist"}
        response = self.client.put(f"/service-tickets/{self.ticket.id}", json=payload)
        self.assertEqual(response.status_code, 404)
