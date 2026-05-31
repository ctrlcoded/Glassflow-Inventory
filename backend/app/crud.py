from sqlalchemy.orm import Session
from fastapi import HTTPException
from . import models, schemas

# --- Products ---

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_product_by_sku(db: Session, sku: str):
    return db.query(models.Product).filter(models.Product.sku == sku).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_update: schemas.ProductUpdate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
        
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product

# --- Customers ---

def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def get_customer_by_email(db: Session, email: str):
    return db.query(models.Customer).filter(models.Customer.email == email).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Customer).offset(skip).limit(limit).all()

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int):
    db_customer = get_customer(db, customer_id)
    if db_customer:
        db.delete(db_customer)
        db.commit()
    return db_customer

# --- Orders ---

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()

def create_order(db: Session, order: schemas.OrderCreate):
    # 1. Verify Customer exists
    db_customer = get_customer(db, order.customer_id)
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    total_amount = 0.0
    order_items = []

    # 2. Process each item, check inventory, deduct stock, calculate total
    for item in order.items:
        db_product = get_product(db, item.product_id)
        
        if not db_product:
            raise HTTPException(status_code=404, detail=f"Product ID {item.product_id} not found")
            
        if db_product.quantity < item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient inventory for product {db_product.name}. Requested: {item.quantity}, Available: {db_product.quantity}"
            )

        # Deduct inventory
        db_product.quantity -= item.quantity
        
        # Calculate amount for this item
        item_total = db_product.price * item.quantity
        total_amount += item_total
        
        # Create OrderItem model
        order_items.append(
            models.OrderItem(
                product_id=db_product.id,
                quantity=item.quantity,
                price_at_time=db_product.price
            )
        )

    # 3. Create the Order
    db_order = models.Order(
        customer_id=order.customer_id,
        status=order.status,
        total_amount=total_amount
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # 4. Attach Items to Order and save
    for oi in order_items:
        oi.order_id = db_order.id
        db.add(oi)
        
    db.commit()
    db.refresh(db_order)
    
    return db_order

def delete_order(db: Session, order_id: int):
    db_order = get_order(db, order_id)
    if not db_order:
        return None
    
    # Restore inventory for each item in the order
    for item in db_order.items:
        db_product = get_product(db, item.product_id)
        if db_product:
            db_product.quantity += item.quantity
    
    db.delete(db_order)
    db.commit()
    return db_order
