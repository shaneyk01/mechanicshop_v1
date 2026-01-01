from marshmallow import fields, validate
from app.extension import ma
from app.models import ServiceTicket
from app.blueprints.mechanics.schemas import MechanicSchema  

class ServiceTicketSchema(ma.SQLAlchemyAutoSchema):
    # explicit fields
    id = ma.auto_field(dump_only=True)
    Date = fields.DateTime(required=True)
    customer_id = ma.auto_field(required=True)
    mechanic_id = ma.auto_field(required=True)
    service_description = fields.String(required=True, validate=validate.Length(min=1, max=1000))

    # include assigned mechanics in responses (optional)
    mechanics = fields.List(
        fields.Nested(MechanicSchema(only=("id", "name", "email"))),
        dump_only=True
    )

    class Meta:
        model = ServiceTicket
        load_instance = False
        include_fk = True
        include_relationships = True
        # limit output fields (adjust as needed)
        fields = ("id", "Date", "customer_id", "service_description", "mechanic_id", "mechanics")

class EditTicketSchema(ma.Schema):
    add_mechanic_ids = fields.List(fields.Int, required=True)
    remove_mechanic_ids = fields.List(fields.Int, required=True)
    add_item = fields.List(fields.Int, required=False, load_default=[])
    remove_item = fields.List(fields.Int, required=False, load_default=[])
    
    class Meta:
        fields = ("add_mechanic_ids", "remove_mechanic_ids", "add_item", "remove_item")





service_ticket_schema = ServiceTicketSchema()
service_tickets_schema = ServiceTicketSchema(many=True)
return_ticket_schema = ServiceTicketSchema(exclude=['customer_id'])
edit_ticket_schema = EditTicketSchema()   