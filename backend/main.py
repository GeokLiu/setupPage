from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import shutil
import uuid
import os

app = FastAPI()

# ---------- In-memory DB ----------
users_db = {}  # key: ic_number, value: dict

# ---------- Models ----------


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

# ---------- Routes ----------

# Step 1: Signup IC info


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

# Step 2: Upload voice


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

# Step 3: Security questions


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

# Step 4: Set user mode


@app.post("/user-mode")
def set_user_mode(data: UserModeReque
