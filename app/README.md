# App – Parkshare Market Analysis

Ce document détaille l'architecture et les étapes pour lancer la partie logicielle (App) du projet, composée d'un Backend en Python (FastAPI) et d'un Frontend en React (Vite).

## 🛠 Stack technique

- **Base de données** : SQLite (`parkshare.db`)
- **Backend / API** : FastAPI (Python)
- **Frontend / Dashboard** : React + Tailwind CSS + Leaflet (Vite)

---

## 🚀 Lancer le projet (Guide Complet)

Le projet nécessite de faire tourner **le backend et le frontend en même temps**, dans deux terminaux différents.

### Étape 1 : Préparation des données

Si la base de données n'est pas encore remplie, ingérer le fichier de données livré par l'équipe Data :
```bash
cd app/db
python seed.py
```

⚠️ **Fichier attendu** : `data/delivery/parkshare_analyse_potentiel.xls`

Le script va automatiquement :
- Créer les tables dans la base SQLite
- Ingérer les données brutes (623 692 lignes)
- Agréger par commune (18 758 communes)
- Calculer les scores de potentiel (0-100) avec pondération :
  - 50% nombre de copropriétés
  - 30% total lots de stationnement
  - 20% taux de motorisation

### Étape 2 : Lancer le Backend (FastAPI)
```bash
pip install fastapi uvicorn pandas openpyxl xlrd
cd app/backend
uvicorn main:app --reload
```

✅ **Backend disponible sur** : `http://127.0.0.1:8000`
📚 **Documentation Swagger** : `http://127.0.0.1:8000/docs`

### Étape 3 : Lancer le Frontend (React + Vite)

⚠️ **ATTENTION** : Le frontend se trouve dans `app/frontend/src/`.
```bash
cd app/frontend/src
npm install --legacy-peer-deps
npm run dev -- --force
```

✅ **Dashboard disponible sur** : `http://localhost:5173` (ou `5174`/`5175`)

---

## 📊 Schéma de la base de données

### `raw_coproprietes` — Données brutes
| Colonne | Type | Description |
|--------|------|-------------|
| code_commune | TEXT | Code postal de la commune |
| nom_officiel_commune | TEXT | Nom officiel |
| nombre_de_lots_de_stationnement | REAL | Lots de stationnement |
| nombre_total_de_lots | REAL | Total de lots |
| type_de_syndic | TEXT | Type de syndic |
| lat | REAL | Latitude GPS |
| long | REAL | Longitude GPS |
| pourcentage_motorisation | REAL | Taux de motorisation (%) |
| population_municipale | REAL | Population municipale |

### `transformed_communes` — Données agrégées par commune
| Colonne | Type | Description |
|--------|------|-------------|
| code_commune | TEXT | Code postal |
| nom_commune | TEXT | Nom de la commune |
| lat / long | REAL | Coordonnées GPS |
| total_stationnement | REAL | Total lots stationnement |
| total_lots | REAL | Total lots copropriétés |
| nb_coproprietes | INTEGER | Nombre de copropriétés |
| pourcentage_motorisation | REAL | Taux motorisation moyen (%) |
| population_municipale | REAL | Population municipale |

### `kpi_scores` — Scores finaux
| Colonne | Type | Description |
|--------|------|-------------|
| code_commune | TEXT | Code postal |
| nom_commune | TEXT | Nom de la commune |
| lat / long | REAL | Coordonnées GPS |
| score_potentiel | REAL | Score global (0-100) |
| rank | INTEGER | Classement national |
| nb_coproprietes | INTEGER | Nombre de copropriétés |
| total_stationnement | REAL | Total lots stationnement |
| pourcentage_motorisation | REAL | Taux de motorisation (%) |

---

## 🔌 Routes API

| Méthode | Route | Description |
|--------|-------|-------------|
| GET | `/api/scores` | Tous les scores triés par rang |
| GET | `/api/scores/top/{n}` | Top N zones |
| GET | `/api/stats/{code_insee}` | Stats d'une commune |
| GET | `/api/global-stats` | KPIs globaux (cards en haut) |

---

## 🖥 Dashboard

### Fonctionnalités
- **Carte interactive** : Vraie carte OpenStreetMap avec points géolocalisés colorés selon le score (vert ≥ 80, orange ≥ 50, rouge < 50)
- **Filtres dynamiques** : Filtrer par ville et par niveau de score
- **KPI Cards** : Score moyen, taux de motorisation, copropriétés, part logements collectifs
- **Classement** : Top zones prioritaires avec score, copropriétés et taux de motorisation

### Pages disponibles
| Page | Description |
|------|-------------|
| Vue d'ensemble | KPIs globaux, carte, classement |
| Carte Interactive | Carte plein écran avec filtres |
| Opportunités | Tableau complet des zones |
| Clients / Paramètres | En construction 🚧 |