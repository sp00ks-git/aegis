from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import validators
import datetime
import hashlib
import socket
import dns.resolver
import whois
import requests
import ipapi
from email_validator import validate_email, EmailNotValidError

import auth
import database
import schemas
from database import SessionLocal, engine

database.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://localhost:3000",
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
        exif_data={"Make": "Apple", "Model": "iPhone 12"},
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

@app.post("/api/email-validator")
async def email_validator(email: str, current_user: str = Depends(auth.oauth2_scheme)):
    try:
        validate_email(email)
        return {"email": email, "valid": True}
    except EmailNotValidError as e:
        return {"email": email, "valid": False, "error": str(e)}

@app.post("/api/username-searcher")
async def username_searcher(username: str, current_user: str = Depends(auth.oauth2_scheme)):
    sites = {
        "instagram": f"https://www.instagram.com/{username}",
        "facebook": f"https://www.facebook.com/{username}",
        "twitter": f"https://www.twitter.com/{username}",
        "github": f"https://www.github.com/{username}",
        "linkedin": f"https://www.linkedin.com/in/{username}",
    }
    results = {}
    for site, url in sites.items():
        try:
            response = requests.get(url)
            if response.status_code == 200:
                results[site] = "Found"
            else:
                results[site] = "Not Found"
        except requests.exceptions.RequestException:
            results[site] = "Error"
    return {"username": username, "results": results}

@app.post("/api/phone-number-info")
async def phone_number_info(phone: str, current_user: str = Depends(auth.oauth2_scheme)):
    from phonenumbers import geocoder, carrier, timezone
    try:
        phone_number = phonenumbers.parse(phone, None)
        if not phonenumbers.is_valid_number(phone_number):
            raise HTTPException(status_code=400, detail="Invalid phone number")
        return {
            "country": geocoder.description_for_number(phone_number, "en"),
            "carrier": carrier.name_for_number(phone_number, "en"),
            "timezone": timezone.time_zones_for_number(phone_number),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/ip-geolocation")
async def ip_geolocation(ip: str, current_user: str = Depends(auth.oauth2_scheme)):
    try:
        location = ipapi.location(ip)
        return {"ip": ip, "location": location}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/whois-lookup")
async def whois_lookup(domain: str, current_user: str = Depends(auth.oauth2_scheme)):
    try:
        w = whois.whois(domain)
        return {"domain": domain, "whois": w}
    except whois.parser.PywhoisError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/subdomain-finder")
async def subdomain_finder(domain: str, current_user: str = Depends(auth.oauth2_scheme)):
    subdomains = []
    common_subdomains = ['www', 'mail', 'ftp', 'localhost', 'test', 'dev', 'staging', 'api', 'admin']
    for subdomain in common_subdomains:
        try:
            dns.resolver.resolve(f"{subdomain}.{domain}", 'A')
            subdomains.append(f"{subdomain}.{domain}")
        except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.resolver.NoNameservers):
            pass
    return {"domain": domain, "subdomains": subdomains}

@app.post("/api/dns-lookup")
async def dns_lookup(domain: str, current_user: str = Depends(auth.oauth2_scheme)):
    records = {}
    for record_type in ['A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA']:
        try:
            answers = dns.resolver.resolve(domain, record_type)
            records[record_type] = [r.to_text() for r in answers]
        except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN, dns.resolver.NoNameservers):
            records[record_type] = []
    return {"domain": domain, "records": records}

@app.post("/api/port-scanner")
async def port_scanner(host: str, current_user: str = Depends(auth.oauth2_scheme)):
    open_ports = []
    for port in range(1, 1025):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        socket.setdefaulttimeout(1)
        result = sock.connect_ex((host, port))
        if result == 0:
            open_ports.append(port)
        sock.close()
    return {"host": host, "open_ports": open_ports}

@app.post("/api/http-header-viewer")
async def http_header_viewer(url: str, current_user: str = Depends(auth.oauth2_scheme)):
    if not validators.url(url):
        raise HTTPException(status_code=400, detail="Invalid URL")
    try:
        response = requests.get(url)
        return {"headers": dict(response.headers)}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/hashing-utility")
async def hashing_utility(text: str, current_user: str = Depends(auth.oauth2_scheme)):
    hashes = {
        'md5': hashlib.md5(text.encode()).hexdigest(),
        'sha1': hashlib.sha1(text.encode()).hexdigest(),
        'sha256': hashlib.sha256(text.encode()).hexdigest(),
        'sha512': hashlib.sha512(text.encode()).hexdigest(),
    }
    return {"hashes": hashes}
