# Guide de contribution – ElectroAudiogram Monorepo

Merci de votre intérêt pour contribuer à **ElectroAudiogram** ! 🎶✨  
Ce projet open-source rassemble les outils numériques du festival.  

## 🚀 Comment contribuer ?
1. **Fork** le dépôt et créez une branche :
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```
2. **Installer les dépendances** :
   ```bash
   pnpm install
   ```
3. **Développer et tester localement** :
   ```bash
   pnpm dev
   pnpm test
   ```
4. **Soumettre une Pull Request (PR)** vers la branche `main`.

## ✅ Bonnes pratiques
- Suivre les règles ESLint et Prettier (`pnpm lint && pnpm format`).
- Ajouter des tests si vous modifiez du code.
- Documenter vos changements dans le README de l’app/package concerné.
- Préfixer les commits avec le type de modification (`feat:`, `fix:`, `docs:`…).

## 📂 Structure utile
- `apps/` → applications (CMS, website, editor, design-system)
- `packages/` → packages réutilisables
- `tools/` → configurations partagées

## 🛡️ Sécurité
- Ne jamais commiter de secrets ou fichiers `.env`.
- Les déploiements utilisent GitHub Actions avec secrets privés.

## 🤝 Code de conduite
En contribuant, vous acceptez de respecter notre [Code of Conduct](./CODE_OF_CONDUCT.md).
