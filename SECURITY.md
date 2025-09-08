# Politique de sécurité – ElectroAudiogram

Nous prenons la sécurité de ce projet très au sérieux.  

## 🔎 Signalement d’une faille
Si vous découvrez une vulnérabilité :
1. **Ne l’exploitez pas** publiquement.
2. Envoyez un mail à : [security@electroaudiogram.fr](mailto:security@electroaudiogram.fr).
3. Donnez autant de détails que possible (fichiers, versions, reproduction).

## 🔐 Gestion des secrets
- Aucun secret n’est commité dans ce repo.
- Les déploiements utilisent **GitHub Actions Secrets**.
- Les forks et PR externes n’ont pas accès aux secrets.

## 🛠️ Bonnes pratiques recommandées
- Toujours utiliser `.env.example` comme base locale.
- Ne pas publier de logs contenant des clés ou tokens.
- Vérifier les dépendances avec `pnpm audit`.

## ⏱️ SLA (Service Level Agreement)
- Nous accusons réception sous **48h**.
- Un correctif ou un plan de mitigation est proposé sous **7 jours** selon la gravité.
