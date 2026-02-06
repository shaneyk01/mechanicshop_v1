
from flask import jsonify, request
from marshmallow import ValidationError 
from sqlalchemy import select
from app.models import db, Customer,ServiceTicket
from . import customers_bp
from .schemas import customer_schema, customers_schema, login_schema
from app.extension import limiter, cache
from app.utils.auth import encode_customer_token, token_required

@customers_bp.route('/login', methods=["POST"])
def customer_login():
    try:
        creds = login_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    query = select(Customer).where(Customer.email == creds['email'])
    customer = db.session.execute(query).scalars().first()
    if customer and customer.password == creds['password']:
        token = encode_customer_token(customer.id)
        return jsonify({'token': token}), 200
       

@customers_bp.route('/', methods=['POST'])
@limiter.limit("15/hour")
def create_customer():
    try:
        customer_data = customer_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    query = select(Customer).where(Customer.email == customer_data['email'])
    existing_customer = db.session.execute(query).scalars().all()
                
    if existing_customer:
        return jsonify({'message': 'Customer with this email already exists.'}), 400

    new_customer = Customer(**customer_data)
    db.session.add(new_customer)
    db.session.commit()
    return customer_schema.jsonify(new_customer), 201

@customers_bp.route('/',methods=['GET'])
@cache.cached(timeout=30)
def get_customers():
    query =select(Customer)
    customers= db.session.execute(query).scalars().all()
    return customers_schema.jsonify(customers), 200

@customers_bp.route('/<int:customer_id>',methods=['GET'])
def get_a_customer(customer_id):
    customer=db.session.get(Customer, customer_id)
    if customer:
        return customer_schema.jsonify(customer),200
    else:
         return jsonify({'message':'Customer not found'}),404



@customers_bp.route('/<int:customer_id>', methods=['PUT'])
@token_required
def update_customer(current_user, customer_id):
    customer = db.session.get(Customer, customer_id)
    if not customer:
        return jsonify({'message': 'Customer not found'}), 404
    if current_user.id != customer.id:
        return jsonify({'message': 'Unauthorized to update this customer'}), 403
    try:
        customer_data = customer_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    for key, value in customer_data.items():
        setattr(customer, key, value)
    db.session.commit()
    return customer_schema.jsonify(customer), 200

@customers_bp.route('/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    customer = db.session.get(Customer, customer_id)
    if not customer:
        return jsonify({'message': 'Customer not found'}), 404

    db.session.delete(customer)
    db.session.commit()
    return jsonify({'message': f'Customer id:{customer_id}, was deleted successfully'}), 200

@customers_bp.route ('/service-tickets', methods=['GET'])
@token_required
def get_customer_tickets(customer_id):
    customer = db.session.get(Customer, request.customer_id)
    if not customer:    
        return jsonify({'message': 'Customer not found'}), 404  
    query = select(ServiceTicket).where(ServiceTicket.customer_id == customer.id)
    tickets = db.session.execute(query).scalars().all()
    return jsonify({
        'customer_id': customer.id,
        'service_tickets':[
            {
                'ticket_id': ticket.id,
                'date': ticket.Date,
                'service_description': ticket.service_description
            } for ticket in tickets
        ]

    }), 200
