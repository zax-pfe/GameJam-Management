<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

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

[À COMPLÉTER : framework, langage, base de données, style/UI, hébergement]

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
