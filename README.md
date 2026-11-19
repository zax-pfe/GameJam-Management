# Game Project Manager

Outil de gestion de projet pour **une** équipe qui développe **un** jeu : tickets (Kanban, calendrier, vue par catégorie), équipe, Project Hub (liens partagés) et dashboard de progression.

Stack : Next.js 16 (App Router, JavaScript), SCSS modules, Supabase (Postgres, Auth Google, Storage, Realtime), Radix Primitives, dnd-kit, FullCalendar, lucide-react.

## 1. Installer

```bash
npm install
```

Node 20 ou plus récent.

## 2. Configurer Supabase (une seule fois)

1. Créer un projet sur [supabase.com](https://supabase.com).
2. **SQL Editor** : exécuter `supabase/migrations/0001_init.sql` (tables, RLS, bucket `images`, Realtime).
3. **SQL Editor** : modifier puis exécuter `supabase/seed.sql` avec **votre** email Google. C'est le premier membre, donc la première personne autorisée à se connecter.
4. **Authentication > Providers > Google** : activer Google avec un Client ID / Secret créés dans Google Cloud Console (OAuth client « Web application »). Dans Google Cloud, ajouter comme *Authorized redirect URI* l'URL de callback affichée par Supabase (`https://<projet>.supabase.co/auth/v1/callback`).
5. **Authentication > URL Configuration** : *Site URL* = `http://localhost:3000` ; ajouter `http://localhost:3000/auth/callback` (et l'URL de production plus tard) dans *Redirect URLs*.
6. Copier `.env.example` en `.env.local` et remplir les valeurs (**Project Settings > Data API** pour l'URL, **API Keys** pour la clé publishable) :

```
NEXT_PUBLIC_SUPABASE_URL=https://<projet>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…   # ou NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

## 3. Lancer

```bash
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run start    # sert le build
npm run lint
```

## Accès

- Connexion uniquement avec Google. Aucune page n'est accessible sans être connecté.
- Seuls les comptes dont l'email figure dans **Team** peuvent entrer (sinon : écran « compte non invité »). Pour inviter quelqu'un, ajoutez-le dans Team avec son email Google.
- Tous les membres ont les mêmes droits. La RLS Postgres l'impose aussi côté base.
- Les commentaires et modifications de tickets sont attribués automatiquement au membre connecté.

## Organisation du code

```
supabase/            schéma SQL (migrations) + seed du premier membre
src/proxy.js         protection des routes + rafraîchissement de session (ex-middleware)
src/app/             routes : (app)/ (Dashboard, Tasks, Team, Hub), login, auth/callback, styleguide
src/store/           DataProvider : source de données unique, mutations optimistes, sync Realtime
src/components/      ui/ (design system), layout/, tickets/, tasks/, team/, hub/, dashboard/
src/lib/             constantes métier, format, filtres, images, clients Supabase
src/styles/          tokens (DESIGN.MD), mixins, styles globaux
```

**Synchronisation** : toutes les vues lisent les mêmes données dans `DataProvider`. Une modification met à jour l'état local immédiatement (toutes les vues changent sans rechargement), puis est écrite dans Supabase. Supabase Realtime prévient les autres onglets et coéquipiers, qui rechargent la table concernée.

**Progression** : `% = tickets Done / total`, recalculé à chaque rendu à partir de la liste des tickets (`src/lib/stats.js`).

## Styleguide (dev uniquement)

`http://localhost:3000/styleguide` : tokens et composants, avec des données fictives (fonctionne sans Supabase, 404 en production).

- `?panel=t1` ouvre le panneau ticket.
- `?screen=dashboard|tasks|team|hub` affiche une vraie page avec les données fictives.

## Déploiement (Cloudflare Workers)

Le code reste du Next.js standard ; l'adaptateur [OpenNext](https://opennext.js.org/cloudflare) (`@opennextjs/cloudflare`) le transforme en Worker. Config : `wrangler.jsonc` (nom du Worker : `game-project-manager`) et `open-next.config.ts`.

1. Se connecter à Cloudflare (une fois) : `npx wrangler login`
2. Vérifier en local dans le runtime Cloudflare : `npm run preview` (http://localhost:8787)
3. Déployer : `npm run deploy` → URL `https://game-project-manager.<compte>.workers.dev`
4. Dans Supabase > *Authentication > URL Configuration* : *Site URL* = l'URL du Worker, et ajouter `https://game-project-manager.<compte>.workers.dev/auth/callback` dans *Redirect URLs*.

Les variables `NEXT_PUBLIC_SUPABASE_*` sont lues dans `.env.local` **au moment du build** (elles sont publiques et intégrées au bundle) : rien à configurer côté Cloudflare.

> `cacheComponents` n'est pas activé : l'adaptateur Cloudflare ne le supporte pas encore (pages en erreur 500), et l'app n'en tire aucun bénéfice puisque ses données sont chargées dans le navigateur.
