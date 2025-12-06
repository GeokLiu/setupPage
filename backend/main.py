from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import shutil
import uuid
import os

from fastapi.middleware.cors import CORSMiddleware

# ------------------------------------------------------
# 1. Create FastAPI app FIRST
# ------------------------------------------------------
app = FastAPI()

# ------------------------------------------------------
# 2. Apply CORS BEFORE defining routes
# ------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import FastAPI, UploadFile, File

app = FastAPI()

@app.post("/extract-ic")
async def extract_ic(front_ic: UploadFile = File(...), back_ic: UploadFile = File(...)):
    # Mock data
    return {
        "fullName": "TAN SENG HONG",
        "icNumber": "85031205",
        "address": "277 JALAN PERKASA 1 TAMAN MALURI,55100, KUALA LUMPUR"
    }





# ------------------------------------------------------
# 4. In-memory Database
# ------------------------------------------------------
users_db = {}  # key: ic_number, value: user dictionary


# ------------------------------------------------------
# 5. Pydantic Models
# ------------------------------------------------------
class SignUpStep1Request(BaseModel):
    ic_number: str
    name: str
    address: str

class SecurityQuestions(BaseModel):
    ic_number: str
    question1: str
    answer1: str
    question2: str
    answer2: str

class UserModeRequest(BaseModel):
    ic_number: str
    mode: str  # normal, rural, easy, senior

class LoginRequest(BaseModel):
    ic_number: str
    voice_verified: bool = False
    answer1: Optional[str] = None
    answer2: Optional[str] = None


# ------------------------------------------------------
# 6. Routes
# ------------------------------------------------------

# Step 1: Save IC info
@app.post("/signup-step1")
def signup_step1(data: SignUpStep1Request):
    if data.ic_number in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    users_db[data.ic_number] = {
        "name": data.name,
        "address": data.address,
        "voice_path": None,
        "security": None,
        "mode": None,
        "ic_front": None,
        "ic_back": None
    }
    return {"message": "Step 1 completed"}


# Step 1b: Upload IC images
@app.post("/signup-ic")
def upload_ic(ic_number: str = Form(...), front: UploadFile = File(...), back: UploadFile = File(...)):
    user = users_db.get(ic_number)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    os.makedirs("ic_images", exist_ok=True)

    front_path = f"ic_images/{ic_number}_front_{uuid.uuid4()}.png"
    back_path = f"ic_images/{ic_number}_back_{uuid.uuid4()}.png"

    with open(front_path, "wb") as f:
        shutil.copyfileobj(front.file, f)
    with open(back_path, "wb") as f:
        shutil.copyfileobj(back.file, f)

    user["ic_front"] = front_path
    user["ic_back"] = back_path

    return {"message": "IC images uploaded"}


# Step 2: Upload Voice
@app.post("/signup-voice")
def signup_voice(ic_number: str = Form(...), file: UploadFile = File(...)):
    user = users_db.get(ic_number)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    os.makedirs("voices", exist_ok=True)

    voice_path = f"voices/{ic_number}_{uuid.uuid4()}.wav"
    with open(voice_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    user["voice_path"] = voice_path

    return {"message": "Voice saved"}


# Step 3: Security Questions
@app.post("/signup-security")
def signup_security(data: SecurityQuestions):
    user = users_db.get(data.ic_number)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["security"] = {
        "question1": data.question1,
        "answer1": data.answer1,
        "question2": data.question2,
        "answer2": data.answer2
    }

    return {"message": "Security questions saved"}


# Step 4: Set User Mode
@app.post("/user-mode")
def set_user_mode(data: UserModeRequest):
    user = users_db.get(data.ic_number)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["mode"] = data.mode

    return {"message": "User mode set"}
