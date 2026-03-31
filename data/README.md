# 📊 Data — Documentation Technique

---

## 1. L'échelle sur les Communes

Pour répondre à la problématique de Parkshare (déployer une solution de parking partagé en France), nous avons fait le choix de travailler à l'**échelle de la Commune**.

- La politique de stationnement (gratuité, tarification voirie, zones piétonnes) est une **compétence municipale**. La tension de stationnement se mesure donc naturellement à l'échelle de la ville.
- C'est le seul échelon géographique commun et fiable qui permettait de **croiser nos différentes sources** (INSEE, Impôts, Registre des copropriétés) de manière précise sur l'ensemble du territoire français.

---

## 2. Choix des Données et Pertinence par rapport à la Problématique

Pour modéliser la rentabilité d'une zone, nous avons construit notre dataset autour de **4 sources via l'Open Data** (Data.gouv / INSEE) :

### 🏢 Registre des Copropriétés — data.gouv
**Données exploitées :** Coordonnées GPS, nombre de lots de stationnement, type de syndic.

> Nous avons pris cette donnée pour **localiser précisément les places privées** et cibler les gestionnaires professionnels, plus simples à démarcher.

### 🚗 Taux de motorisation par communes — data.gouv
**Données exploitées :** Part des ménages disposant d'au moins une voiture par commune.

> C'est notre **indicateur de demande**. Nous avons choisi cette donnée car l'offre n'a de valeur que là où les habitants possèdent réellement des véhicules à garer.

### 👥 Densité de la population par communes — INSEE
**Données exploitées :** Population municipale.

> C'est notre **facteur de saturation**. Nous avons pris cette data car la rareté des places en surface (concurrence pour l'espace public) n'existe que dans les zones denses.

### 💰 Revenus médians par communes — data.gouv
**Données exploitées :** Revenu disponible médian par commune.

> C'est notre **filtre de rentabilité**. Nous avons sélectionné cette data pour identifier les zones "Premium" où les utilisateurs ont un fort consentement à payer pour un parking sécurisé.

---

## 3. Nettoyage et Ingénierie des Données (Data Cleaning)

Le traitement de notre base de données initiale (**plus de 620 000 lignes**) a nécessité plusieurs arbitrages techniques pour garantir la fiabilité de nos KPIs :

### 🗺️ Correction Géographique (Mapping)
Le dataset des copropriétés n'avait pas de code commune. Nous avons créé un **dictionnaire de mapping** (`Nom de la ville → Code officiel`) pour récupérer ces lignes sans perte d'information.

### ✂️ Technique d'Amputation (Suppression)
- Les lignes **sans coordonnées GPS** ou sans volume de stationnement ont été supprimées (données non exploitables).
- Les lignes **sans donnée de population** (représentant moins de 0.2% du dataset) ont également été amputées car statistiquement non significatives.

### 🔧 Techniques d'Imputation (Remplacement des valeurs manquantes)

| Donnée | % manquant | Méthode | Justification |
|---|---|---|---|
| Taux de motorisation | 7.5% | Médiane globale | Conserver les données de copropriété associées |
| Revenus médians | 12.5% (~78 000 lignes) | Médiane du département | Communes de petite taille — imputation cohérente au niveau socio-éco |

> Pour les revenus médians, amputer 12.5% du dataset aurait représenté une perte massive. L'**imputation par la médiane du département** garantit une estimation socio-économique cohérente.

---

## 4. Construction des KPIs Stratégiques

Ces données nettoyées et fusionnées nous ont permis de générer **4 KPIs** :

### 🏆 Score Final Parkshare
Ce score global classe les communes en combinant :

| Critère | Poids |
|---|---|
| Offre de places (copropriétés) | 25% |
| Motorisation | 25% |
| Densité | 20% |
| Revenu | 20% |
| Facilité de signature (syndic pro) | 10% |

> Il permet d'identifier les **zones prioritaires** en équilibrant le besoin technique et la rentabilité commerciale.

### 📈 Indice d'Attractivité Économique (IAE)
Cet indice croise le **revenu des habitants** avec le **nombre de places** pour mettre en avant les zones les plus riches. L'utilisation du **logarithme** permet de valoriser les résidences de taille moyenne sans que les très grands immeubles ne faussent tout le classement.

### 🤝 Taux de Facilitation de Signature
Ce KPI mesure le **pourcentage de syndics professionnels** présents dans une zone donnée. Plus ce taux est élevé, plus Parkshare pourra déployer sa solution rapidement en signant des contrats avec des gestionnaires d'immeubles réactifs.

### 📋 Top N des Zones Prioritaires
Ce classement final liste les **meilleures opportunités de prospection** pour les équipes commerciales. C'est un outil opérationnel qui transforme l'analyse de données en une **liste d'actions concrètes sur le terrain**.
