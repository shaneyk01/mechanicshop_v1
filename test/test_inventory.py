import unittest
from app import create_app
from app.models import db, Inventory

class TestInventory(unittest.TestCase):

    def setUp(self):
        self.app = create_app("TestingConfig")
        self.app.testing = True
        self.client = self.app.test_client()

        self.ctx = self.app.app_context()
        self.ctx.push()

        db.drop_all()
        db.create_all()

        self.item = Inventory(name="Oil Filter", price=9.99)
        db.session.add(self.item)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    # CRUD TESTS
    def test_create_item_missing_field(self):
        payload = {"price": 10.00}
        response = self.client.post("/inventory/", json=payload)
        self.assertEqual(response.status_code, 400)

    def test_get_item_invalid(self):
        response = self.client.get("/inventory/9999")
        self.assertEqual(response.status_code, 404)

    def test_update_item_invalid(self):
        payload = {"name": "New Name", "price": "notanumber"}
        response = self.client.put(f"/inventory/{self.item.id}", json=payload)
        self.assertEqual(response.status_code, 400)

    def test_delete_item_invalid(self):
        response = self.client.delete("/inventory/9999")
        self.assertEqual(response.status_code, 404)

