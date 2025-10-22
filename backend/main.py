from fastapi import FastAPI, Request
from pydantic import BaseModel
import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Connection(BaseModel):
    id: int
    ip_address: str
    location: str
    timestamp: datetime.datetime
    duration: int

@app.post("/api/connections")
async def log_connection(request: Request):
    data = await request.json()
    return {
        "id": 1,
        "ip_address": request.client.host,
        "location": data.get("location"),
        "timestamp": datetime.datetime.utcnow(),
        "duration": data.get("duration"),
    }

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status
from backend import auth

mock_user = {
    "username": "sp00ks",
    "hashed_password": auth.get_password_hash("Th3devilisn3ar@@*&"),
}

from fastapi import Response

@app.post("/token")
async def login_for_access_token(
    response: Response, form_data: OAuth2PasswordRequestForm = Depends()
):
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:8080"
    if not auth.verify_password(form_data.password, mock_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": mock_user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/connections")
def get_connections():
    return [
        {
            "id": 1,
            "ip_address": "127.0.0.1",
            "location": "Test Location 1",
            "timestamp": datetime.datetime.utcnow(),
            "duration": 10,
        },
        {
            "id": 2,
            "ip_address": "127.0.0.2",
            "location": "Test Location 2",
            "timestamp": datetime.datetime.utcnow(),
            "duration": 20,
        },
    ]

from fastapi import File, UploadFile

@app.post("/api/metadata")
async def get_metadata(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "mock_metadata": {
            "Make": "Apple",
            "Model": "iPhone 12",
        },
    }
