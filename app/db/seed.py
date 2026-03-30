import sqlite3
import pandas as pd
import os

# Chemins
DB_PATH = os.getenv("DB_PATH", "./parkshare.db")
EXCEL_PATH = "../../data/delivery/parkshare_analyse_potentiel.xls"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    return conn

def init_db(conn):
    """Créer les tables si elles n'existent pas"""
    schema_path = os.path.join(os.path.dirname(__file__), "shema.sql")
    with open(schema_path, "r", encoding="utf-8") as f:
        conn.executescript(f.read())
    conn.commit()
    print("✅ Tables créées")

def seed_raw(conn, df):
    """Ingérer les données brutes"""
    df_raw = df.rename(columns={
        "code_commune": "code_commune",
        "nom_officiel_commune": "nom_officiel_commune",
        "nombre_de_lots_de_stationnement": "nombre_de_lots_de_stationnement",
        "nombre_total_de_lots": "nombre_total_de_lots",
        "type_de_syndic_benevole_professionnel_non_connu": "type_de_syndic",
        "lat": "lat",
        "long": "long",
        "Pourcentage_motorisation": "pourcentage_motorisation",
        "Population_municipale": "population_municipale"
    })
    df_raw.to_sql("raw_coproprietes", conn, if_exists="replace", index=False)
    print(f"✅ raw_coproprietes ingéré ({len(df_raw)} lignes)")

def seed_transformed(conn, df):
    """Agréger par commune"""
    df_grouped = df.groupby(["code_commune", "nom_officiel_commune"]).agg(
        lat=("lat", "first"),
        long=("long", "first"),
        total_stationnement=("nombre_de_lots_de_stationnement", "sum"),
        total_lots=("nombre_total_de_lots", "sum"),
        nb_coproprietes=("nom_officiel_commune", "count"),
        pourcentage_motorisation=("Pourcentage_motorisation", "mean"),
        population_municipale=("Population_municipale ", "first")
    ).reset_index()

    df_grouped = df_grouped.rename(columns={
        "nom_officiel_commune": "nom_commune"
    })

    df_grouped.to_sql("transformed_communes", conn, if_exists="replace", index=False)
    print(f"✅ transformed_communes ingéré ({len(df_grouped)} communes)")

def seed_kpis(conn):
    """Calculer les scores et classements"""
    df = pd.read_sql("""
        SELECT 
            code_commune,
            nom_commune,
            lat,
            long,
            nb_coproprietes,
            total_stationnement,
            pourcentage_motorisation
        FROM transformed_communes
    """, conn)

    # Normalisation 0-100
    def normalize(series):
        min_val = series.min()
        max_val = series.max()
        if max_val == min_val:
            return pd.Series([50] * len(series))
        return ((series - min_val) / (max_val - min_val)) * 100

    df["score_coproprietes"] = normalize(df["nb_coproprietes"])
    df["score_stationnement"] = normalize(df["total_stationnement"])
    df["score_motorisation"] = normalize(df["pourcentage_motorisation"])

    # Score final pondéré
    df["score_potentiel"] = (
        df["score_coproprietes"] * 0.5 +
        df["score_stationnement"] * 0.3 +
        df["score_motorisation"] * 0.2
    ).round(1)

    df["rank"] = df["score_potentiel"].rank(ascending=False).astype(int)
    df = df.sort_values("rank")

    df[["code_commune", "nom_commune", "lat", "long", "score_potentiel",
        "rank", "nb_coproprietes", "total_stationnement",
        "pourcentage_motorisation"]].to_sql(
        "kpi_scores", conn, if_exists="replace", index=False
    )
    print(f"✅ kpi_scores calculé ({len(df)} communes)")

if __name__ == "__main__":
    if not os.path.exists(EXCEL_PATH):
        print(f"❌ Fichier non trouvé : {EXCEL_PATH}")
        exit(1)

    print("📂 Lecture du fichier Excel...")
    df = pd.read_csv(EXCEL_PATH, sep=";", encoding="utf-8-sig")

    conn = get_db()
    init_db(conn)
    seed_raw(conn, df)
    seed_transformed(conn, df)
    seed_kpis(conn)
    conn.close()
    print("🎉 Seed terminé !")