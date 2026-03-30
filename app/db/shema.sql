-- ============================================
-- TABLES BRUTES (données brutes reçues de Data)
-- ============================================

-- Données brutes telles que reçues du fichier Excel de l'équipe Data
CREATE TABLE IF NOT EXISTS raw_coproprietes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code_commune TEXT,                          -- Code postal de la commune
    nom_officiel_commune TEXT,                  -- Nom officiel de la commune
    nombre_de_lots_de_stationnement REAL,       -- Nombre de lots de stationnement
    nombre_total_de_lots REAL,                  -- Nombre total de lots
    type_de_syndic TEXT,                        -- Type de syndic (bénévole/professionnel/non connu)
    lat REAL,                                   -- Latitude GPS
    long REAL,                                  -- Longitude GPS
    pourcentage_motorisation REAL,              -- Taux de motorisation (%)
    population_municipale REAL,                 -- Population municipale
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLES TRANSFORMÉES
-- ============================================

-- Données agrégées par commune (une ligne par commune)
CREATE TABLE IF NOT EXISTS transformed_communes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code_commune TEXT,                          -- Code postal
    nom_commune TEXT,                           -- Nom de la commune
    lat REAL,                                   -- Latitude GPS
    long REAL,                                  -- Longitude GPS
    total_stationnement REAL,                   -- Total lots de stationnement
    total_lots REAL,                            -- Total lots copropriétés
    nb_coproprietes INTEGER,                    -- Nombre de copropriétés
    pourcentage_motorisation REAL,              -- Taux de motorisation moyen (%)
    population_municipale REAL                  -- Population municipale
);

-- ============================================
-- TABLES KPIs
-- ============================================

-- Scores et classements finaux par commune, prêts à l'affichage
CREATE TABLE IF NOT EXISTS kpi_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code_commune TEXT,                          -- Code postal
    nom_commune TEXT,                           -- Nom de la commune
    lat REAL,                                   -- Latitude GPS (pour la carte)
    long REAL,                                  -- Longitude GPS (pour la carte)
    score_potentiel REAL,                       -- Score global de potentiel (0-100)
    rank INTEGER,                               -- Classement
    nb_coproprietes INTEGER,                    -- Nombre de copropriétés
    total_stationnement REAL,                   -- Total lots de stationnement
    pourcentage_motorisation REAL               -- Taux de motorisation (%)
);