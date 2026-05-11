from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import shutil
import os
import cv2
import numpy as np

app = FastAPI()

# ==============================
# CORS
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# PATHS
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FRONTEND_DIR = os.path.join(BASE_DIR, "../frontend")

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ==============================
# STATIC FILES
# ==============================
app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")

app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")

# ==============================
# FRONTEND ROUTES
# ==============================

@app.get("/")
def login_page():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

@app.get("/dashboard")
def dashboard():
    return FileResponse(os.path.join(FRONTEND_DIR, "dashboard.html"))

@app.get("/reports")
def reports():
    return FileResponse(os.path.join(FRONTEND_DIR, "reports.html"))

@app.get("/analytics")
def analytics():
    return FileResponse(os.path.join(FRONTEND_DIR, "analytics.html"))

@app.get("/alerts")
def alerts():
    return FileResponse(os.path.join(FRONTEND_DIR, "alerts.html"))

@app.get("/road-damage")
def road_damage():
    return FileResponse(os.path.join(FRONTEND_DIR, "road_damage.html"))

@app.get("/discover")
def discover():
    return FileResponse(os.path.join(FRONTEND_DIR, "discover.html"))

# ==============================
# AI ROAD DAMAGE DETECTION
# ==============================

@app.post("/detect-road-damage")
async def detect_damage(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    img = cv2.imread(file_path)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # EDGE DETECTION
    edges = cv2.Canny(gray, 100, 200)

    edge_density = np.sum(edges > 0) / (
        gray.shape[0] * gray.shape[1]
    )

    # TEXTURE ANALYSIS
    variance = np.var(gray)

    # SMART AI-LIKE LOGIC
    if edge_density > 0.15 and variance > 500:
        result = "Severe Road Damage 🚨"

    elif edge_density > 0.08:
        result = "Moderate Road Damage ⚠️"

    else:
        result = "Road looks normal ✅"

    return {
        "message": result,
        "edge_density": float(edge_density),
        "texture_variance": float(variance)
    }