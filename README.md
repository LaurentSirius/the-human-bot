# The Human Bot — site vitrine

Site minimaliste (fond noir, typo pixel) pour le projet musical **The Human Bot**.  
Stack : **Astro** (TypeScript) + **Decap CMS** + prêt pour **Netlify**.

## Prérequis

- Node.js **22+** (voir `.nvmrc`)
- npm 10+

## Lancer en local

```bash
cd the-human-bot
npm install
npm run dev
```

Ouvrir l’URL affichée (souvent `http://localhost:4321`).

Autres commandes :

```bash
npm run build    # génère le site dans dist/
npm run preview  # prévisualise le build de production
```

## Pages

| Route   | Contenu                                      |
|---------|----------------------------------------------|
| `/`     | Accueil : vidéo, tagline, boutons sociaux    |
| `/music`| Liste des sorties / vidéos (contenu CMS)     |
| `/links`| Instagram, YouTube, stickers / QR            |
| `/admin`| Interface Decap CMS                         |

## Contenu éditable

- **Accueil & réglages** : `src/data/settings.json` (titre, accroche, vidéo d’accueil `featuredYoutube`, boutons)
- **Sorties / Morceaux** : `src/content/releases/*.md` (champ `youtube` = n’importe quel lien YouTube)
- **Liens** : `src/content/links/*.md`

Les liens YouTube sont acceptés sous toutes les formes (`youtube.com/watch?v=…`, `youtu.be/…`,
`/shorts/…`, `/live/…`, ou l’ID seul) : voir `src/lib/youtube.ts`. Les anciens champs
`youtubeId` / `youtubeUrl` / `featuredYoutubeId` restent acceptés.

## Utiliser l’admin — mode d’emploi (pour les musiciens 🎛️)

1. Aller sur **https://the-human-bot.netlify.app/admin/** et se connecter (e-mail + mot de passe).
2. À gauche, 4 rubriques :
   - **🏠 Accueil & réglages** → la vidéo principale, la phrase d’accroche, les 3 boutons du bas.
   - **🎵 Sorties / Morceaux** → les clips de la page Music.
   - **🔗 Liens** → les cadres cliquables de la page Links.
   - **❓ Mode d’emploi** → ce guide, directement dans l’admin.
3. **Ajouter un morceau** : 🎵 Sorties / Morceaux → **« + Sortie »** → titre + lien YouTube
   (sur YouTube : « Partager » → « Copier »). Facultatif : date, description,
   **★ Mettre en avant** (= tout en haut de la page Music), position dans la liste.
4. À droite, **l’aperçu en direct** montre le rendu au style du site (fond noir, typo pixel).
5. Cliquer sur **« Publier »** (puis « Publier maintenant »). Le site se met à jour tout seul en 1 à 2 minutes.

Chaque champ a une petite aide en dessous ; les champs « (optionnel) » peuvent rester vides.
Ordre de la page Music : mis en avant d’abord, puis « Position dans la liste » (1 = en haut), puis les plus récents.
Pas de workflow de validation : « Publier » met en ligne directement (chaque publication = un commit Git, donc tout est réversible).

Fichiers de l’admin : `public/admin/config.yml` (champs), `public/admin/cms-setup.js`
(encadrés d’aide + aperçus), `public/admin/preview.css` (copie de `src/styles/global.css`
pour les aperçus — à garder synchronisée si le design change).

## Decap CMS (`/admin`)

L’admin est servi en statique depuis `public/admin/` (Decap CMS + widget Netlify Identity).

### En production (Netlify)

1. Déployer le repo sur Netlify (`netlify.toml` est déjà présent).
2. Activer **Identity** (Authentication) dans le dashboard Netlify.
3. Activer **Git Gateway** (Identity → Services → Git Gateway).
4. Inviter un utilisateur (Identity → Invite users) pour se connecter à `/admin`.
5. Les modifications faites dans l’admin créent des commits sur la branche `main` via Git Gateway.

Sans Identity + Git Gateway, l’écran de login `/admin` ne pourra pas s’authentifier.

### En local (optionnel)

Pour éditer sans Netlify Identity, décommenter dans `public/admin/config.yml` :

```yaml
local_backend: true
```

Puis dans un second terminal :

```bash
npx decap-server
```

Relancer `npm run dev` et ouvrir `/admin`. Le proxy local écrit directement dans les fichiers du projet.

> **Attention** : ne laissez pas `local_backend: true` activé sur le déploiement Netlify.

## Design

- Fond noir, texte blanc uniquement
- Police pixel : [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (Google Fonts)
- Accueil : titre empilé en haut à gauche, navigation en haut à droite, embed YouTube centré, boutons outline en bas

## Déploiement

Le projet est prêt pour Netlify (`publish = dist`, Node 22).  
Ne pas déployer ni pousser sur GitHub tant que ce n’est pas demandé.

Placeholder backend GitHub (alternative à Git Gateway) possible dans `public/admin/config.yml` :

```yaml
backend:
  name: github
  repo: VOTRE_ORG/the-human-bot
  branch: main
```

## Structure

```
src/
  content/          # Markdown (releases, links)
  data/settings.json
  layouts/
  pages/
  styles/global.css
public/admin/       # Decap CMS
netlify.toml
```
