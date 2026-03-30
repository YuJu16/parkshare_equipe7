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

@app.get("/api/global-stats")
def get_global_stats():
    """
    Retourne les 4 KPIs globaux affichés en haut du dashboard :
    - avg_score_potentiel   : Score de Potentiel Moyen
    - avg_taux_motorisation : Taux de Motorisation Moyen (%)
    - total_coproprietes    : Total des logements collectifs (Copropriétés Ciblées)
    - avg_part_collectif    : Part Moyenne de Logements Collectifs (%)
    """
    conn = get_db()

    # Score moyen depuis kpi_scores
    row_score = conn.execute(
        "SELECT ROUND(AVG(score_potentiel), 1) AS avg_score FROM kpi_scores"
    ).fetchone()

    # Métriques depuis transformed_zones
    row_zones = conn.execute(
        """
        SELECT
            ROUND(AVG(taux_motorisation), 1)        AS avg_motorisation,
            SUM(nb_logements_collectifs)             AS total_coproprietes,
            ROUND(AVG(part_collectif), 1)            AS avg_part_collectif
        FROM transformed_zones
        """
    ).fetchone()

    conn.close()

    return {
        "avg_score_potentiel":   row_score["avg_score"]         if row_score else 0,
        "avg_taux_motorisation": row_zones["avg_motorisation"]   if row_zones else 0,
        "total_coproprietes":    row_zones["total_coproprietes"] if row_zones else 0,
        "avg_part_collectif":    row_zones["avg_part_collectif"] if row_zones else 0,
    }