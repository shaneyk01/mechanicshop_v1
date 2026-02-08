from flask import jsonify, request
from marshmallow import ValidationError 
from sqlalchemy import select
from app.models import db, Inventory
from . import inventory_bp
from .schemas import item_schema,items_schema
from app.extension import limiter, cache

@inventory_bp.route('/', methods=['POST'])
def create_inventory_item():
	try:
		item_data = item_schema.load(request.json)
	except ValidationError as e:
		return jsonify(e.messages), 400

	new_item = Inventory(**item_data)
	db.session.add(new_item)
	db.session.commit()
	return item_schema.jsonify(new_item), 201

@inventory_bp.route('/', methods=['GET'])
def get_all_item():
	items = db.session.execute(select(Inventory)).scalars().all()
	return items_schema.jsonify(items, many=True), 200

@inventory_bp.route('/<int:item_id>', methods=['GET'])
def get_an_item(item_id):
	item = db.session.get(Inventory, item_id)
	if not item:
		return jsonify({'message': 'Inventory item not found'}), 404
	return item_schema.jsonify(item), 200

@inventory_bp.route('/<int:item_id>', methods=['PUT'])
def update_item(item_id):
	item = db.session.get(Inventory, item_id)
	if not item:
		return jsonify({'message': 'item item not found'}), 404

	try:
		item_data = item_schema.load(request.json)
	except ValidationError as e:
		return jsonify(e.messages), 400

	for key, value in item_data.items():
		setattr(item, key, value)

	db.session.commit()
	return item_schema.jsonify(item), 200

@inventory_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_inventory_item(item_id):
	item = db.session.get(Inventory, item_id)
	if not item:
		return jsonify({'message': 'item item not found'}), 404

	db.session.delete(item)
	db.session.commit()
	return jsonify({'message': f'Inventory item id:{item_id} was deleted successfully'}), 200

