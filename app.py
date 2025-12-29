from flask import Flask, render_template, request, send_file, redirect
import os, uuid, traceback
from PIL import Image
from pdf2docx import Converter
from docx2pdf import convert

app = Flask(__name__)

UPLOAD = "uploads"
OUTPUT = "outputs"
os.makedirs(UPLOAD, exist_ok=True)
os.makedirs(OUTPUT, exist_ok=True)

@app.route("/")
def home():
    return render_template("landing.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

# ---------- IMAGE → PDF ----------
@app.route("/img2pdf", methods=["POST"])
def img2pdf():
    try:
        images = []
        name = "images"

        for f in request.files.getlist("files"):
            name = os.path.splitext(f.filename)[0]
            images.append(Image.open(f).convert("RGB"))

        out = f"{OUTPUT}/{name}_converted.pdf"
        images[0].save(out, save_all=True, append_images=images[1:])
        return send_file(out, as_attachment=True, download_name=os.path.basename(out))

    except Exception:
        traceback.print_exc()
        return {"error": "Image conversion failed"}, 500

# ---------- PDF → DOCX ----------
@app.route("/pdf2docx", methods=["POST"])
def pdf2docx():
    try:
        f = request.files["file"]
        name = os.path.splitext(f.filename)[0]

        ip = f"{UPLOAD}/{uuid.uuid4()}.pdf"
        op = f"{OUTPUT}/{name}_converted.docx"

        f.save(ip)
        cv = Converter(ip)
        cv.convert(op)
        cv.close()

        return send_file(op, as_attachment=True, download_name=os.path.basename(op))

    except Exception:
        traceback.print_exc()
        return {"error": "PDF to DOCX failed"}, 500

# ---------- DOCX → PDF (SAFE MODE) ----------
@app.route("/docx2pdf", methods=["POST"])
def docx2pdf_route():
    try:
        f = request.files["file"]
        name = os.path.splitext(f.filename)[0]

        ip = f"{UPLOAD}/{uuid.uuid4()}.docx"
        op = f"{OUTPUT}/{name}_converted.pdf"

        f.save(ip)
        convert(ip, op)

        return send_file(op, as_attachment=True, download_name=os.path.basename(op))

    except Exception:
        traceback.print_exc()
        return {"error": "DOCX to PDF not supported on this system"}, 500

app.run(host="0.0.0.0", port=5000, debug=True)
