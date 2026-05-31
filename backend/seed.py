from app.database import SessionLocal, engine, Base
from app.models import Product, Customer, Order, OrderItem
import random
from datetime import datetime, timedelta

def seed_database():
    db = SessionLocal()
    
    # Check if we already have data
    if db.query(Product).count() > 0:
        print("Database already seeded!")
        return

    print("Seeding database with initial data...")

    # Create Products
    products = [
        Product(name="Ergonomic Office Chair", sku="FUR-001", price=299.00, quantity=45),
        Product(name="Pro Laptop Stand", sku="ACC-102", price=45.00, quantity=0),
        Product(name="Noise Cancelling Headphones", sku="ELC-204", price=199.50, quantity=5),
        Product(name="Mechanical Keyboard", sku="ELC-305", price=129.99, quantity=24),
        Product(name="Wireless Mouse", sku="ELC-112", price=49.99, quantity=8),
        Product(name="Standing Desk Frame", sku="FUR-042", price=399.00, quantity=12),
        Product(name="LED Desk Lamp", sku="LGT-012", price=35.00, quantity=30),
        Product(name="Power Extension Cord", sku="ACC-099", price=15.00, quantity=2),
    ]
    
    db.add_all(products)
    db.commit()

    # Create Customers
    customers = [
        Customer(name="Eleanor Crane", email="eleanor.c@example.com", phone="(555) 019-2834"),
        Customer(name="Marcus Reed", email="m.reed.logistics@example.com", phone="(555) 438-9901"),
        Customer(name="Sophia Lin", email="sophia_lin_design@example.com", phone="(555) 762-1188"),
        Customer(name="Jackson Davis", email="jdavis@supplyco.net", phone="(555) 203-4556"),
        Customer(name="Acme Corp", email="contact@acme.com", phone="(555) 123-4567"),
    ]

    db.add_all(customers)
    db.commit()

    # Get DB references
    db_products = db.query(Product).all()
    db_customers = db.query(Customer).all()

    # Create some orders
    for i in range(15):
        cust = random.choice(db_customers)
        status = random.choice(["Processing", "Shipped", "Delivered"])
        
        order = Order(
            customer_id=cust.id,
            status=status,
            order_date=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
            total_amount=0
        )
        db.add(order)
        db.commit()
        db.refresh(order)

        # Add 1 to 3 items per order
        total = 0
        for _ in range(random.randint(1, 3)):
            prod = random.choice(db_products)
            qty = random.randint(1, 3)
            
            # Simple stock deduction logic for seed script
            if prod.quantity >= qty:
                prod.quantity -= qty
            
            price_at_time = prod.price
            total += (price_at_time * qty)
            
            item = OrderItem(
                order_id=order.id,
                product_id=prod.id,
                quantity=qty,
                price_at_time=price_at_time
            )
            db.add(item)
        
        order.total_amount = total
        db.commit()

    print("Seed complete!")

if __name__ == "__main__":
    seed_database()
