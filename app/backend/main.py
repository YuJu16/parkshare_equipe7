from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.getenv("DB_PATH", "../db/parkshare.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/api/scores")
def get_scores():
    conn = get_db()
    cursor = conn.execute("SELECT * FROM kpi_scores ORDER BY rank ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.get("/api/scores/top/{n}")
def get_top_scores(n: int):
    conn = get_db()
    cursor = conn.execute("SELECT * FROM kpi_scores ORDER BY rank ASC LIMIT ?", (n,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.get("/api/stats/{code_insee}")
def get_stats(code_insee: str):
    conn = get_db()
    cursor = conn.execute(
        "SELECT * FROM transformed_zones WHERE code_insee = ?", (code_insee,)
    )
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else {"error": "Commune non trouvée"}