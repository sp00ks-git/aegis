from pydantic import BaseModel

class ConnectionBase(BaseModel):
    location: str
    duration: int

class ConnectionCreate(ConnectionBase):
    pass

class Connection(ConnectionBase):
    id: int
    ip_address: str
    timestamp: str

    class Config:
        from_attributes = True

class MetadataBase(BaseModel):
    filename: str
    content_type: str
    metadata: dict

class MetadataCreate(MetadataBase):
    pass

class Metadata(MetadataBase):
    id: int

    class Config:
        from_attributes = True

class PasteBase(BaseModel):
    filename: str
    content_type: str

class PasteCreate(PasteBase):
    pass

class Paste(PasteBase):
    id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True
