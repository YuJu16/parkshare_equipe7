import sqlite3
import pandas as pd
import os

# Chemins
DB_PATH = os.getenv("DB_PATH", "./parkshare.db")
DATA_DIR = "../../data/delivery"  # Dossier de livraison Data

def get_db():
    conn = sqlite3.connect(DB_PATH)
    return conn

def init_db(conn):
    """Créer les tables si elles n'existent pas"""
    with open("../db/schema.sql", "r") as f:
        conn.executescript(f.read())
    conn.commit()
    print("✅ Tables créées")

def seed_raw_zones(conn):
    """Ingérer le fichier zones brutes"""
    path = f"{DATA_DIR}/zones.csv"
    if not os.path.exists(path):
        print(f"⚠️  Fichier non trouvé : {path}")
        return
    df = pd.read_csv(path)
    df.to_sql("raw_zones", conn, if_exists="replace", index=False)
    print(f"✅ raw_zones ingéré ({len(df)} lignes)")

def seed_raw_stats(conn):
    """Ingérer le fichier stats brutes"""
    path = f"{DATA_DIR}/stats.csv"
    if not os.path.exists(path):
        print(f"⚠️  Fichier non trouvé : {path}")
        return
    df = pd.read_csv(path)
    df.to_sql("raw_stats", conn, if_exists="replace", index=False)
    print(f"✅ raw_stats ingéré ({len(df)} lignes)")

def seed_kpi_scores(conn):
    """Ingérer le fichier KPIs scores"""
    path = f"{DATA_DIR}/kpi_scores.csv"
    if not os.path.exists(path):
        print(f"⚠️  Fichier non trouvé : {path}")
        return
    df = pd.read_csv(path)
    df.to_sql("kpi_scores", conn, if_exists="replace", index=False)
    print(f"✅ kpi_scores ingéré ({len(df)} lignes)")

if __name__ == "__main__":
    conn = get_db()
    init_db(conn)
    seed_raw_zones(conn)
    seed_raw_stats(conn)
    seed_kpi_scores(conn)
    conn.close()
    print("🎉 Seed terminé")