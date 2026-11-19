# RÔLE

Tu es un développeur full-stack senior. Tu construis « Game Project Manager », une application web de gestion de projet pour UNE équipe qui développe UN jeu vidéo. Tu travailles de façon autonome mais par étapes, en validant chaque étape avant de passer à la suivante.

# OBJECTIF

Livrer une application simple, visuelle et rapide permettant à toute l'équipe de :

1. Organiser le travail : créer des tickets, les assigner, suivre leur avancement.
2. Visualiser la production : Kanban, calendrier, vue par catégorie.
3. Centraliser les ressources : un index de liens partagés (Project Hub).

# RÈGLES NON NÉGOCIABLES

- Projet unique : ne rends RIEN générique, multi-projets ou hautement personnalisable.
- Simplicité d'abord : n'ajoute aucune fonctionnalité qui n'est pas listée ci-dessous. Si tu penses qu'une fonctionnalité manque, propose-la en fin de réponse, sans l'implémenter.
- Tous les membres ont les mêmes droits : consulter, créer/modifier des tickets, commenter, ajouter des ressources. Pas de système de permissions.
- Source de données unique : toutes les vues lisent les mêmes tickets. Modifier un ticket dans une vue met à jour toutes les autres immédiatement.
- Interface agréable, claire, rapide. Les infos importantes sont accessibles en quelques clics.
- Si une information essentielle manque, pose UNE question groupée avant de coder, puis avance.

# STACK TECHNIQUE

- Next.js (App Router), JavaScript. Le projet existe déjà : ne pas le recréer.
- SCSS avec CSS Modules + fichier de tokens global (couleurs, typo, espacements).
- Supabase : Postgres, Auth (Google OAuth), Storage (avatars et images de tickets).
- Composants accessibles sans style (Radix ou React Aria), dnd-kit pour le Kanban, une librairie existante pour le calendrier.
- Déploiement ultérieur sur Cloudflare Workers : écrire du Next.js standard, sans code spécifique à Cloudflare.

# AUTHENTIFICATION ET ACCÈS

- Connexion uniquement via Google (Supabase Auth). Aucune page n'est accessible sans être connecté.
- Chaque utilisateur connecté est lié à un profil de membre (Team).
- Les commentaires et modifications sont attribués à l'utilisateur connecté.
- Activer la RLS sur toutes les tables ; tous les membres autorisés ont les mêmes droits.

# PAGES

Dashboard / Tasks / Team / Project Hub

# 1. TEAM

CRUD complet des membres (ajouter, modifier, supprimer, lister).
Champs : nom, prénom, photo ou avatar, rôle.
Rôles : Game Designer, Developer, 3D Artist, 2D Artist, UI/UX Designer, Art Director, Sound Designer, Autre.

# 2. TICKETS

Chaque membre peut créer, modifier, supprimer un ticket.
Champs :

- Nom de la tâche (obligatoire)
- Type : Design, Development, 3D, 2D / Art, UI/UX, Audio, Other
- Membre(s) assigné(s) : un ou plusieurs
- Statut : To Do, In Progress, Done
- Image facultative (ajout / suppression)
- Durée estimée
- Complexité facultative : Simple, Medium, Complex
- Date (nécessaire pour la vue calendrier)
- Commentaires : tous les membres peuvent commenter ; afficher auteur et date de publication

# 3. VUES DES TICKETS (page Tasks)

A. Kanban (vue principale)

- 3 colonnes : To Do, In Progress, Done
- Drag & drop entre colonnes et réorganisation au sein d'une colonne
- Cartes affichant : nom, type, membres assignés, durée, complexité
- Clic sur une carte : ouverture du ticket pour consultation et modification
- Ajout rapide d'un ticket depuis une colonne

B. Calendrier

- Vues mensuelle et hebdomadaire
- Tickets positionnés selon leur date, déplaçables sur le calendrier
- Filtres applicables

C. Par catégorie

- Tickets regroupés par type de tâche (Design, Development, 3D, Art, UI/UX, Audio)

D. Filtres (utilisables dans toutes les vues où c'est pertinent)

- Par membre assigné, type de tâche, durée estimée, statut

# 4. DASHBOARD

- Progression globale en % = tickets Done / total des tickets (calcul automatique)
- Nombre total de tickets, terminés, en cours, à faire
- Aperçu du Project Hub, facilement accessible depuis le dashboard

# 5. PROJECT HUB

Index de liens partagés par toute l'équipe.
Actions : ajouter, modifier, supprimer, consulter, organiser par catégorie.
Champs : nom du lien, URL, catégorie, description (facultative), icône ou miniature (facultative).
Catégories : Design / Figma, Google Drive, Development / GitHub, Documentation, References, Assets, Other.

# MÉTHODE DE TRAVAIL

Avance dans cet ordre et arrête-toi après chaque étape pour que je valide :

1. Plan : stack retenue, modèle de données, arborescence du projet, questions ouvertes.
2. Fondations : projet, base de données, modèles (Membre, Ticket, Commentaire, Ressource), layout et navigation.
3. Team.
4. Tickets : CRUD, fiche ticket, commentaires, upload d'image.
5. Vue Kanban avec drag & drop.
6. Filtres, vue par catégorie, vue Calendrier.
7. Project Hub.
8. Dashboard (statistiques et progression).
9. Finitions : états vides, erreurs, responsive, performances.

# CRITÈRES DE VALIDATION

- Une modification faite dans une vue apparaît dans toutes les autres sans rechargement manuel.
- Le % de progression reste juste après tout changement de statut, création ou suppression de ticket.
- Aucune fonctionnalité hors périmètre n'a été ajoutée.
- Le code est lisible, organisé, et tu expliques comment lancer le projet.

# FORMAT DE RÉPONSE

À chaque étape : ce que tu as fait, comment le tester, ce qui vient ensuite. Pas de longs discours.

# TIMELINE DE DÉVELOPPEMENT (tenue à jour par Claude)

Légende : [x] terminé · [~] en cours · [ ] à faire · [!] bloqué (raison indiquée)
Règle : à chaque tâche terminée, cocher la case, dater, et noter en une ligne ce qui a été livré.

## Décisions techniques

- Données : Supabase (Postgres + Auth Google + Storage + Realtime). Toutes les vues lisent un store client unique alimenté par Supabase ; Realtime propage les changements aux autres onglets/utilisateurs.
- Styles : SCSS modules + tokens issus de DESIGN.MD (Tailwind du scaffold retiré).
- UI : Radix Primitives, dnd-kit (Kanban), FullCalendar (calendrier), lucide-react.
- React Compiler actif : dans une fonction définie dans un composant, toujours écrire `x?.id` si `x` peut être null (le compiler lit les propriétés dès le rendu → crash « reading id of null »).
- Next.js 16 : `proxy.js` (ex-middleware) pour la protection des routes ; lire `node_modules/next/dist/docs/` avant toute API Next.

## Étape 1 · Plan

- [x] T01 · Analyse CLAUDE.MD + DESIGN.MD + scaffold existant, découpage en tâches (2026-11-19)
- [x] T02 · Questions ouvertes tranchées (2026-11-19) : code d'abord, projet Supabase branché plus tard via `.env.local` ; accès = liste blanche des emails des membres Team (1er membre via seed SQL)

## Étape 2 · Fondations

- [x] T03 · Nettoyage du scaffold, dépendances (sass, supabase-js, @supabase/ssr, radix, dnd-kit, fullcalendar, lucide), retrait Tailwind — fait le 2026-11-19 : deps installées, Tailwind + fichiers du template supprimés, .env.example, config eslint/next
- [x] T04 · Tokens SCSS + styles globaux + polices IBM Plex (next/font) — fait le 2026-11-19 : src/styles/_tokens.scss (tokens DESIGN.MD), _mixins.scss, globals.scss, IBM Plex via next/font, loadPaths SCSS
- [x] T05 · Schéma SQL Supabase : members, tickets, ticket_assignees, comments, resources + RLS + buckets Storage + publication Realtime — fait le 2026-11-19 : supabase/migrations/0001_init.sql + seed.sql ; validé sous PGlite (contraintes, attribution auto, RLS non-membre bloqué, usurpation de commentaire bloquée)
- [x] T06 · Clients Supabase (navigateur / serveur), `proxy.js`, page Login Google, callback OAuth, état « compte non invité » — fait le 2026-11-19 : lib/supabase (client/server/config), src/proxy.js (session + redirection), /login (bouton Google, états non invité / non configuré), /auth/callback (vérif. liste blanche via rpc is_member)
- [x] T07 · Store client unique (chargement initial, mutations optimistes, abonnement Realtime) — fait le 2026-11-19 : src/store/DataProvider.js : useData(), chargement + contrôle membre, mutations optimistes, resync Realtime (members/tickets/assignees/resources) + au retour d'onglet, upload images redimensionnées
- [x] T08 · Composants de base : Button, Input, Select, Chip, Avatar, Modal, ConfirmDialog, Toast, Menu, Tooltip, EmptyState, Skeleton — fait le 2026-11-19 : components/ui : Button, IconButton, Field/Input/Textarea/Select, chips (type/statut/rôle/catégorie), complexité, Avatar(+Stack), Modal, ConfirmDialog, Toast, Menu, Tooltip, EmptyState, Skeleton, SegmentedControl, ImageDrop
- [x] T09 · App shell : sidebar / rail / barre mobile, topbar, menu utilisateur (déconnexion) — fait le 2026-11-19 : route group (app) + AppShell (providers, DataGate chargement/erreur), Sidebar 240px / rail 64px / tab bar mobile, Topbar (titre, action, menu utilisateur + déconnexion), build OK
- [x] T10 · Page `/styleguide` (dev uniquement) — fait le 2026-11-19 : /styleguide (404 en prod, public en dev) : couleurs, typo, boutons, champs, chips, avatars, toasts, modales, état vide, skeleton, écran de validation Kanban (3 cartes) + panneau ticket (?panel=t1) sur données fictives ; vérifié par capture

## Étape 3 · Team

- [x] T11 · Page Team : grille de membres, ajout / édition (photo → Storage), suppression confirmée — fait le 2026-11-19 : components/team : grille (avatar 64, nom, rôle, email), modale ajout/édition (prénom, nom, email Google, rôle, photo redimensionnée → Storage), suppression confirmée, auto-suppression bloquée (évite de se verrouiller dehors)

## Étape 4 · Tickets

- [x] T12 · Composant TicketCard (chips type/statut, complexité, avatars, durée, image) — fait le 2026-11-19 : components/tickets/TicketCard (barre type 3px, image 16:9, chip type, complexité, statut optionnel, avatars max 3 +n, durée) + TicketMenu (Edit, Move to, Delete confirmé)
- [x] T13 · Panneau ticket (slide-over) : propriétés, autosave, sélecteur de membres, suppression — fait le 2026-11-19 : TicketPanel (Radix Dialog slide-over 520px / plein écran mobile) : titre inline, statut, type, assignés (MemberPicker), date, estimation (h), complexité, autosave + indicateur Saved, suppression confirmée, créé/modifié par
- [x] T14 · Image de ticket : upload / aperçu / suppression (Storage) — fait le 2026-11-19 : ImageDrop dans le panneau : glisser-déposer / parcourir, aperçu, remplacer, supprimer (fichier Storage nettoyé)
- [x] T15 · Commentaires : liste (auteur, date) + composer — fait le 2026-11-19 : Comments : fil temps réel (canal Realtime filtré par ticket), auteur + date relative (absolue en tooltip), composer épinglé, Ctrl/Cmd+Entrée

## Étape 5 · Kanban

- [x] T16 · Vue Kanban : 3 colonnes, compteurs, ajout rapide par colonne — fait le 2026-11-19 : KanbanBoard : 3 colonnes (icône, compteur, règle graduée), ajout rapide inline (Entrée crée, Échap annule), modale « New ticket », état vide
- [x] T17 · Drag & drop (entre colonnes + réordonnancement, clavier), menu « Move to », onglets mobile — fait le 2026-11-19 : dnd-kit : déplacement entre colonnes + réordonnancement (positions fractionnaires), clavier (Espace saisir/déposer, flèches, Échap), placeholder pointillé guide, colonne survolée teintée, overlay ; mobile : 1 colonne par onglet + menu Move to

## Étape 6 · Filtres, Catégorie, Calendrier

- [x] T18 · Barre de filtres (membre, type, durée, statut), chips actives, persistance entre vues — fait le 2026-11-19 : FiltersBar : Member / Type / Duration (presets) / Status, chips supprimables + Reset, Status désactivé en Kanban, filtres conservés entre vues ; vue + ticket ouvert dans l'URL
- [x] T19 · Vue par catégorie (sections repliables par type) — fait le 2026-11-19 : CategoryView : sections repliables par type (icône/couleur, compteur), grille de cartes avec icône de statut
- [x] T20 · Vue Calendrier mois / semaine, drag d'un ticket vers un autre jour, filtres — fait le 2026-11-19 : CalendarView (FullCalendar v6 stylé tokens) : mois / semaine, drag vers un autre jour, +n more, aujourd'hui en accent, week-ends canvas, compteur de tickets sans date ; mobile : compteur par jour + semaine en liste

## Étape 7 · Project Hub

- [x] T21 · Project Hub : CRUD des liens, groupement par catégorie, miniature facultative — fait le 2026-11-19 : components/hub : groupes par catégorie, ResourceCard (miniature ou icône de catégorie, domaine, description, ouverture nouvel onglet noopener), modale ajout/édition (URL normalisée + validée, miniature facultative), suppression confirmée

## Étape 8 · Dashboard

- [x] T22 · Dashboard : % de progression, compteurs, aperçu du Project Hub — fait le 2026-11-19 : DashboardView : carte progression (% = Done/Total, barre segmentée Done/In Progress, graduations 10 %, légende, « — » si aucun ticket), 4 tuiles, aperçu Hub (6 liens groupés + View all)

## Étape 9 · Finitions

- [x] T23 · États vides, erreurs, skeletons, toasts — fait le 2026-11-19 : pages 404 (not-found) et erreur (error.js), états vides (Kanban, catégorie, Team, Hub, Dashboard, colonnes, commentaires), erreur de chargement + Réessayer, skeletons, toasts sur succès/erreur ; vues réelles vérifiées par capture (/styleguide?screen=dashboard|tasks|team|hub)
- [x] T24 · Responsive (mobile / tablette), accessibilité, reduced motion — fait le 2026-11-19 : sidebar → rail 64px (768-1099) → tab bar (<768), Kanban 1 colonne + onglets sur mobile, modales en bottom sheet, panneau plein écran, cibles tactiles 44px, ids dnd-kit stables, focus visible, labels/aria, prefers-reduced-motion ; vérifié en 1440 / 900 / 600 px
- [x] T25 · Performances, `npm run build` + lint propres, README (lancement du projet) — fait le 2026-11-19 : FullCalendar chargé à la demande, images redimensionnées avant upload, refetch différé pendant les écritures ; eslint 0 erreur, next build OK ; README (installation, config Supabase + Google, lancement, architecture)

## Évolutions demandées

- [x] E01 · Date du jour par défaut à la création d'un ticket — fait le 2026-11-19 : modale « New ticket » pré-remplie, ajout rapide Kanban daté d'aujourd'hui (date effaçable dans le panneau)
- [~] E02 · Description modifiable du ticket — code fait le 2026-11-19 (textarea autosave dans le panneau) ; reste à exécuter supabase/migrations/0002_ticket_description.sql

## Reste à faire (hors code)

- [ ] V01 · Brancher Supabase (README §2) puis tester en conditions réelles : login Google, liste blanche, Realtime entre 2 navigateurs, upload d'images
- [ ] V02 · Valider le design avec /styleguide (DESIGN.MD, étape « validation gate »)
