import sqlite3
import pandas as pd
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "parkshare.db")
DATA_PATH = os.path.join(os.path.dirname(__file__), "../../data/delivery/parkshare_analyse_potentiel.xls")

def create_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("DROP TABLE IF EXISTS kpi_scores")
    conn.execute("""
        CREATE TABLE kpi_scores (
            rank INTEGER,
            code_commune TEXT,
            nom_commune TEXT,
            score_potentiel REAL,
            pourcentage_motorisation REAL,
            nb_coproprietes INTEGER,
            nombre_total_lots INTEGER,
            population REAL,
            lat REAL,
            long REAL
        )
    """)
    conn.commit()
    return conn

def compute_score(row):
    """
    Score potentiel (0-100) basé sur :
    - taux de motorisation (plus élevé = meilleur)
    - nombre de lots de stationnement (plus = mieux)
    - population (plus = mieux)
    """
    motorization = row.get("pourcentage_motorisation", 0) or 0
    nb_lots = row.get("nb_coproprietes", 0) or 0
    population = row.get("population", 1) or 1

    # Normalisation relative - on va normaliser après
    score = (motorization * 0.6) + (min(nb_lots / 10, 30)) + (min(population / 10000, 10))
    return round(score, 2)

def seed():
    print(f"📂 Lecture du fichier : {DATA_PATH}")
    df = pd.read_csv(DATA_PATH, encoding="utf-8-sig", sep=None, engine="python")
    print(f"✅ {len(df)} lignes chargées - Colonnes: {list(df.columns)}")

    # Renommage des colonnes
    df = df.rename(columns={
        "nom_officiel_commune": "nom_commune",
        "Pourcentage_motorisation": "pourcentage_motorisation",
        "nombre_de_lots_de_stationnement": "nb_coproprietes",
        "nombre_total_de_lots": "nombre_total_lots",
        "Population_municipale ": "population",
        "Population_municipale": "population",
    })

    # Nettoyage
    df["pourcentage_motorisation"] = pd.to_numeric(df["pourcentage_motorisation"], errors="coerce").fillna(0)
    df["nb_coproprietes"] = pd.to_numeric(df["nb_coproprietes"], errors="coerce").fillna(0)
    df["population"] = pd.to_numeric(df.get("population", 0), errors="coerce").fillna(0)
    df["lat"] = pd.to_numeric(df["lat"], errors="coerce")
    df["long"] = pd.to_numeric(df["long"], errors="coerce")

    # Calcul du score brut
    df["score_brut"] = df.apply(
        lambda r: compute_score({
            "pourcentage_motorisation": r.get("pourcentage_motorisation", 0),
            "nb_coproprietes": r.get("nb_coproprietes", 0),
            "population": r.get("population", 0),
        }), axis=1
    )

    # Normalisation du score entre 0 et 100
    score_min = df["score_brut"].min()
    score_max = df["score_brut"].max()
    if score_max > score_min:
        df["score_potentiel"] = ((df["score_brut"] - score_min) / (score_max - score_min) * 100).round(1)
    else:
        df["score_potentiel"] = 50.0

    # Trier par score décroissant et attribuer un rang
    df = df.sort_values("score_potentiel", ascending=False).reset_index(drop=True)
    df["rank"] = df.index + 1

    # Garder uniquement les colonnes nécessaires
    cols = ["rank", "code_commune", "nom_commune", "score_potentiel",
            "pourcentage_motorisation", "nb_coproprietes", "nombre_total_lots",
            "population", "lat", "long"]
    # Garder seulement les colonnes existantes
    cols = [c for c in cols if c in df.columns]
    df_final = df[cols].dropna(subset=["lat", "long"])

    # Insérer en DB
    conn = create_db()
    df_final.to_sql("kpi_scores", conn, if_exists="replace", index=False)
    conn.commit()
    conn.close()

    print(f"🎉 Base de données peuplée : {len(df_final)} entrées dans kpi_scores")
    print(f"   Score min: {df_final['score_potentiel'].min()}, max: {df_final['score_potentiel'].max()}")
    print(f"   Exemple: {df_final[['nom_commune','score_potentiel','lat','long']].head(3).to_string()}")

if __name__ == "__main__":
    seed()
