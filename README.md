# Monorepo Electro Audiogram

Bienvenue dans le monorepo du **Festival ElectroAudiogram** – un festival interdisciplinaire de **musiques électroniques**, **arts visuels** et **cultures numériques** organisé à **Caen (France)**.

Ce dépôt rassemble l’ensemble des **outils numériques open-source** utilisés et développés par le festival :

- site web public,
- CMS de gestion (contenus, programmation, artistes…),
- design system (composants UI réutilisables),
- éditeur en ligne (audio & image),
- packages partagés (API client, utilitaires, typages, typographies).

Notre objectif est de **favoriser la collaboration, le partage et l’innovation** autour des pratiques numériques et artistiques.

---

## 📂 Structure du monorepo

```
apps/        → applications (cms, website, editor, design-system)
packages/    → bibliothèques réutilisables (api, ui, fonts, load-env)
tools/       → configurations partagées (typescript, tailwind)
.github/     → workflows CI/CD (lint, tests, build, déploiement)
```

---

## 🚀 Développement local

### Prérequis

- [Node.js](https://nodejs.org/) (version définie dans `.nvmrc`)
- [pnpm](https://pnpm.io/) (installé automatiquement via `corepack`)
- [Docker](https://www.docker.com/) (pour lancer la base de données en local)

### Installation

```bash
cp .env.example .env
pnpm install
```

### Lancer la base de données (développement)

Le fichier [`docker-compose.yml`](./docker-compose.yml) permet de démarrer uniquement la **base de données PostgreSQL** pour un usage local.

```bash
docker compose up -d
```

### Démarrer les applications

```bash
pnpm dev
```

Chaque app utilise le port défini dans `.env.example` :

- CMS → `http://localhost:3000`
- Design System → `http://localhost:3001`
- Website → `http://localhost:3002`
- Editor → `http://localhost:3003`

---

## 🛠️ Scripts disponibles

Depuis la racine du monorepo :

- `pnpm dev` → lancer toutes les apps en mode développement
- `pnpm build` → compiler apps et packages
- `pnpm test` → lancer tous les tests unitaires
- `pnpm lint` → corriger le code avec ESLint
- `pnpm format` → formater le code avec Prettier

---

## 📖 Documentation & Contribution

Nous mettons à disposition des fichiers pour **guider la contribution** et sécuriser le projet :

- [CONTRIBUTING.md](./CONTRIBUTING.md) → guide de contribution
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) → règles de conduite
- [SECURITY.md](./SECURITY.md) → politique de sécurité

Vous pouvez aussi **télécharger tous les fichiers de documentation** dans le ZIP ci-dessous.

---

## 🔐 Sécurité

- Aucun secret n’est commité.
- Les déploiements utilisent GitHub Actions avec **Secrets privés**.
- Les forks publics n’ont pas accès aux secrets.

---

## 📜 Licence

Distribué sous licence [MIT](./LICENCE).
