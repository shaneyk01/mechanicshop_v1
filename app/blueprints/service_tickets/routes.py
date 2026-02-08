from flask import jsonify, request
from marshmallow import ValidationError  # type: ignore
from sqlalchemy import select, func
from . import service_tickets_bp
from .schemas import service_ticket_schema, service_tickets_schema, edit_ticket_schema, return_ticket_schema
from app.blueprints.mechanics.schemas import mechanic_schema
from app.models import ServiceTicket, Mechanic, db, Inventory, ticket_mechanic

@service_tickets_bp.route('/', methods=['POST'])
def create_service_ticket():
    try:
        ticket_data = service_ticket_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    new_ticket = ServiceTicket(**ticket_data)
    db.session.add(new_ticket)
    db.session.commit()
    return service_ticket_schema.jsonify(new_ticket), 201

@service_tickets_bp.route('/', methods=['GET'])
def get_service_tickets():
    tickets = db.session.execute(select(ServiceTicket)).scalars().all()
    return jsonify(service_tickets_schema.dump(tickets)), 200

@service_tickets_bp.route('/<int:service_ticket_id>', methods=['GET'])
def get_a_service_ticket(service_ticket_id):
    ticket = db.session.get(ServiceTicket, service_ticket_id)
    if not ticket:
        return jsonify({'message': 'Service ticket not found'}), 404
    return jsonify(service_ticket_schema.dump(ticket)), 200

@service_tickets_bp.route('/<int:service_ticket_id>', methods=['DELETE'])
def delete_ticket(service_ticket_id):
    service_ticket = db.session.get(ServiceTicket, service_ticket_id)
    if not service_ticket:
        return jsonify({'message': 'Service ticket not found'}), 404
    db.session.delete(service_ticket)
    db.session.commit()
    return jsonify({'message': f'Service ticket id:{service_ticket_id} was deleted successfully'}), 200

@service_tickets_bp.route('/<int:service_ticket_id>/add_mechanic/<int:mechanic_id>', methods=['PUT'])
def add_mechanic(service_ticket_id, mechanic_id):
    ticket = db.session.get(ServiceTicket, service_ticket_id)
    mechanic = db.session.get(Mechanic, mechanic_id)
    if not ticket or not mechanic:
        return jsonify({'error': 'invalid Service ticket or Mechanic'}), 400
    if mechanic not in ticket.mechanics:
        ticket.mechanics.append(mechanic)
        db.session.commit()
        return jsonify({
            "message":"Mechanic added",
            "serviceTicket":service_ticket_schema.dump(ticket),
            "mechanic":mechanic_schema.dump(mechanic)   
        }),200


@service_tickets_bp.route('/<int:service_ticket_id>/remove_mechanic/<int:mechanic_id>', methods=['PUT'])
def remove_mechanic(service_ticket_id, mechanic_id):
    ticket = db.session.get(ServiceTicket, service_ticket_id)
    mechanic = db.session.get(Mechanic, mechanic_id)
    if not ticket or not mechanic:
        return jsonify({'error': 'invalid Service ticket or Mechanic'}), 400
    if mechanic not in ticket.mechanics:
            return jsonify({"error":"Mechanic not assigned to this ticket"}),400    
    ticket.mechanics.remove(mechanic)
    db.session.commit()
    return jsonify({
        "message":"Mechanic removed",
        "serviceTicket":service_ticket_schema.dump(ticket),
        "mechanic":mechanic_schema.dump(mechanic)   
    }),200
    
@service_tickets_bp.route("/<int:service_tickets_id>", methods=['PUT'])
def edit_ticket(service_tickets_id):
    try:
        ticket_edits = edit_ticket_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    query = select(ServiceTicket).where(ServiceTicket.id == service_tickets_id)
    ticket = db.session.execute(query).scalars().first()

    for mechanic_id in ticket_edits['add_mechanic_ids']:
        query = select(Mechanic).where(Mechanic.id == mechanic_id)
        mechanic = db.session.execute(query).scalars().first()

        if mechanic and mechanic not in ticket.mechanics:
            ticket.mechanics.append(mechanic)
        
    for mechanic_id in ticket_edits['remove_mechanic_ids']:
        query = select(Mechanic).where(Mechanic.id == mechanic_id)
        mechanic = db.session.execute(query).scalars().first()
        if mechanic and mechanic in ticket.mechanics:
            ticket.mechanics.remove(mechanic)

    for items_id in ticket_edits['add_item']:
        query = select(Inventory).where(Inventory.id == items_id)
        item = db.session.execute(query).scalars().first()

        if item and item not in ticket.items:
            ticket.items.append(item)
                         
    db.session.commit()
    return return_ticket_schema.jsonify(ticket)