from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import validators
import datetime

from backend import auth, database, schemas
from backend.database import SessionLocal, engine

database.Base.metadata.create_all(bind=engine)

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

# Create a new user when the application starts up
db = SessionLocal()
user = db.query(database.User).filter(database.User.username == "sp00ks").first()
if not user:
    hashed_password = auth.get_password_hash("Th3devilisn3ar@@*&")
    db.add(database.User(username="sp00ks", hashed_password=hashed_password))
    db.commit()
db.close()


# In-memory store for threat attempts
threat_attempts = []

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/token")
async def login_for_access_token(
    request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = (
        db.query(database.User)
        .filter(database.User.username == form_data.username)
        .first()
    )
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        threat_attempts.append({
            "ip_address": request.client.host,
            "location": "Unknown",  # In a real app, you'd get this from an IP geolocation service
            "timestamp": datetime.datetime.utcnow(),
        })
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/threats")
def get_threats(current_user: str = Depends(auth.oauth2_scheme)):
    return threat_attempts


@app.post("/api/connections", response_model=schemas.Connection)
def log_connection(
    connection: schemas.ConnectionCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(auth.oauth2_scheme),
):
    new_connection = database.Connection(**connection.dict())
    db.add(new_connection)
    db.commit()
    db.refresh(new_connection)
    return new_connection


@app.get("/api/connections", response_model=list[schemas.Connection])
def get_connections(
    db: Session = Depends(get_db), current_user: str = Depends(auth.oauth2_scheme)
):
    return db.query(database.Connection).all()


@app.post("/api/metadata", response_model=schemas.Metadata)
def get_metadata(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(auth.oauth2_scheme),
):
    # In a real application, you would extract the metadata here
    new_metadata = database.Metadata(
        filename=file.filename,
        content_type=file.content_type,
        metadata={"Make": "Apple", "Model": "iPhone 12"},
    )
    db.add(new_metadata)
    db.commit()
    db.refresh(new_metadata)
    return new_metadata


@app.post("/api/pastebin", response_model=schemas.Paste)
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(auth.oauth2_scheme),
):
    # In a real application, you would save the file to disk
    new_paste = database.Paste(
        filename=file.filename,
        content_type=file.content_type,
    )
    db.add(new_paste)
    db.commit()
    db.refresh(new_paste)
    return new_paste

@app.post("/api/analyze-url")
async def analyze_url(url: str, current_user: str = Depends(auth.oauth2_scheme)):
    if not validators.url(url):
        raise HTTPException(status_code=400, detail="Invalid URL")
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)
    screenshot = driver.get_screenshot_as_base64()
    text = driver.find_element(By.TAG_NAME, "body").text
    links = [link.get_attribute("href") for link in driver.find_elements(By.TAG_NAME, "a")]
    driver.quit()
    return {"screenshot": screenshot, "text": text, "links": links}
