from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api.api_router import api_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GlassFlow API",
    description="Inventory & Order Management System Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to GlassFlow API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "glassflow-backend"}
