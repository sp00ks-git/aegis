from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import datetime
import os

# Get the absolute path to the directory of the current script.
dir_path = os.path.dirname(os.path.realpath(__file__))

# Define the path for the data directory.
data_dir_path = os.path.join(dir_path, 'data')

# Create the data directory if it doesn't exist.
os.makedirs(data_dir_path, exist_ok=True)

# Define the database URL using an absolute path.
DATABASE_URL = f"sqlite:///{os.path.join(data_dir_path, 'connections.db')}"


engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String, index=True)
    location = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    duration = Column(Integer)

from sqlalchemy.types import JSON

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Metadata(Base):
    __tablename__ = "metadata"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    content_type = Column(String)
    exif_data = Column(JSON)

class Paste(Base):
    __tablename__ = "pastes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    content_type = Column(String)

Base.metadata.create_all(bind=engine)
