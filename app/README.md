# App – Parkshare Market Analysis

## Stack technique

- **Base de données** : SQLite
- **Backend** : FastAPI (Python)
- **Frontend** : React + Tailwind (voir `/app/frontend/`)

---

## Schéma de la base de données

### `raw_zones` — Zones géographiques brutes
| Colonne | Type | Description |
|--------|------|-------------|
| id | INTEGER | Clé primaire |
| commune | TEXT | Nom de la commune |
| code_insee | TEXT | Code INSEE |
| latitude | REAL | Latitude GPS |
| longitude | REAL | Longitude GPS |
| imported_at | TIMESTAMP | Date d'import |

### `raw_stats` — Statistiques brutes par commune
| Colonne | Type | Description |
|--------|------|-------------|
| id | INTEGER | Clé primaire |
| code_insee | TEXT | Clé de jointure |
| population | INTEGER | Population totale |
| nb_logements | INTEGER | Nombre de logements |
| nb_logements_collectifs | INTEGER | Logements collectifs |
| taux_motorisation | REAL | Taux de motorisation (%) |
| imported_at | TIMESTAMP | Date d'import |

### `transformed_zones` — Données nettoyées et enrichies
| Colonne | Type | Description |
|--------|------|-------------|
| id | INTEGER | Clé primaire |
| commune | TEXT | Nom de la commune |
| code_insee | TEXT | Code INSEE |
| latitude | REAL | Latitude GPS |
| longitude | REAL | Longitude GPS |
| population | INTEGER | Population totale |
| nb_logements_collectifs | INTEGER | Logements collectifs |
| taux_motorisation | REAL | Taux de motorisation (%) |
| part_collectif | REAL | Part logements collectifs (%) |

### `kpi_scores` — Scores et classements finaux
| Colonne | Type | Description |
|--------|------|-------------|
| id | INTEGER | Clé primaire |
| commune | TEXT | Nom de la commune |
| code_insee | TEXT | Code INSEE |
| latitude | REAL | Latitude GPS |
| longitude | REAL | Longitude GPS |
| score_potentiel | REAL | Score global (0-100) |
| rank | INTEGER | Classement national |
| score_motorisation | REAL | Composante motorisation |
| score_collectif | REAL | Composante logements collectifs |

---

## Lancer le backend

### 1. Installer les dépendances
```bash
pip install -r backend/requirements.txt
```

### 2. Lancer le serveur
```bash
cd backend
uvicorn main:app --reload
```

### 3. Accéder à la doc API
```
http://127.0.0.1:8000/docs
```

---

## Ingérer les données

Une fois les fichiers livrés par l'équipe Data dans `/data/delivery/` :
```bash
cd db
python seed.py
```

Fichiers attendus :
- `data/delivery/zones.csv`
- `data/delivery/stats.csv`
- `data/delivery/kpi_scores.csv`

---

## Routes API

| Méthode | Route | Description |
|--------|-------|-------------|
| GET | `/api/scores` | Tous les scores triés par rang |
| GET | `/api/scores/top/{n}` | Top N zones |
| GET | `/api/stats/{code_insee}` | Stats d'une commune |



## Frontend

- **Stack** : React + Tailwind CSS
- **Cartographie** : React-Leaflet
- **Graphiques** : Recharts

### Lancer le frontend
```bash
cd frontend
npm install
npm run dev
```

### Accéder au dashboard
```
http://localhost:5173
```

### Pages disponibles
| Page | Description |
|------|-------------|
| Vue d'ensemble | KPIs globaux, carte de chaleur, classement des zones |
| Carte Interactive | Carte détaillée avec filtres |
| Opportunités | Analyse des zones prioritaires |

### Connexion à l'API
Le frontend consomme les routes suivantes :

| Route | Utilisation |
|-------|-------------|
| `GET /api/scores` | Classement des zones |
| `GET /api/scores/top/{n}` | Top N zones |
| `GET /api/global-stats` | KPIs globaux (cards en haut) |
| `GET /api/stats/{code_insee}` | Détail d'une commune |