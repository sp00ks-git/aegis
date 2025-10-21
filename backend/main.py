from fastapi import FastAPI, Request
from pydantic import BaseModel
import datetime

app = FastAPI()

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
