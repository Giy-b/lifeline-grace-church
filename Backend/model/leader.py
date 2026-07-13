from sqlalchemy import Column, Integer, String
from database import Base

class Leader(Base):
    __tablename__ = "leaders"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100))
    phone = Column(String(20), unique=True)
    password = Column(String(100))
    role = Column(String(50))
    branch = Column(String(50))