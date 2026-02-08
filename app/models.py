from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from typing import List
from datetime import datetime


class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

ticket_mechanic = db.Table(
    'ticket_mechanic',
    Base.metadata,
    db.Column('ticket_id', db.Integer, db.ForeignKey('service_tickets.id'), primary_key=True),
    db.Column('mechanic_id', db.Integer, db.ForeignKey('mechanics.id'), primary_key=True)
)

ticket_item = db.Table(
    'ticket_item',
    Base.metadata,
    db.Column('ticket_id', db.Integer, db.ForeignKey('service_tickets.id'), primary_key=True),
    db.Column('item_id', db.Integer, db.ForeignKey('items.id'), primary_key=True)
)

class Customer(Base):
    __tablename__ = 'customers'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(255),nullable=False)    
    email: Mapped[str] = mapped_column(db.String (360), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(db.String(20), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(db.String(255), nullable=False)

    service_tickets: Mapped[List['ServiceTicket']] = db.relationship(back_populates='customers')
                                 
class Mechanic(Base):
    __tablename__ = 'mechanics'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(255), nullable=False)
    email: Mapped[str] = mapped_column(db.String(360), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(db.String(20), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(db.String(255), nullable=False)
    salary: Mapped[int] = mapped_column(db.Integer, nullable=False)

    service_tickets: Mapped[List['ServiceTicket']] = db.relationship(
        secondary=ticket_mechanic,
        back_populates='mechanics'
    )

class ServiceTicket(Base):
    __tablename__ = 'service_tickets'
    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[int] = mapped_column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    mechanic_id: Mapped[int] = mapped_column(db.Integer, db.ForeignKey('mechanics.id'), nullable=False)
    Date: Mapped[datetime] = mapped_column(db.DateTime, nullable=False)
    service_description: Mapped[str] = mapped_column(db.String(1000), nullable=False)
    
    customers: Mapped['Customer'] = db.relationship(back_populates='service_tickets')
    mechanics: Mapped[List['Mechanic']] = db.relationship(
        secondary=ticket_mechanic,
        back_populates='service_tickets'
    )
    items: Mapped[List['Inventory']] = db.relationship(
        secondary=ticket_item,
        back_populates='service_tickets'
    )

class Inventory(Base):
    __tablename__ = 'items'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(255), )
    price: Mapped[float] = mapped_column(db.Float,)

    service_tickets: Mapped[List['ServiceTicket']] = db.relationship(
        secondary=ticket_item,
        back_populates='items'
    )