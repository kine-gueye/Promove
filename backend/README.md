# PROMOVE — API REST (Backend)

API REST développée avec **NestJS** pour **PROMOVE**, plateforme de location de
véhicules et de gestion de parking à Dakar, Sénégal. Ce backend a été conçu pour
être consommé par le frontend React fourni (`location-voiture-unipro`).

> Projet réalisé dans le cadre de l'examen final du module **API REST**
> (M. Soumaré — Licence 2 GI, 2025-2026).

## Sommaire

- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Modèle de données](#modèle-de-données)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Lancer le projet](#lancer-le-projet)
- [Authentification & rôles (RBAC)](#authentification--rôles-rbac)
- [Endpoints principaux](#endpoints-principaux)
- [API externes consommées](#api-externes-consommées)
- [Brancher le frontend existant](#brancher-le-frontend-existant)
- [Tests](#tests)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Git Flow](#git-flow)
- [Bonus implémentés](#bonus-implémentés)
- [Pistes d'amélioration](#pistes-damélioration)

## Stack technique

| Composant       | Choix                                   |
|-----------------|------------------------------------------|
| Framework       | NestJS 10 (Node.js / TypeScript)          |
| Base de données | PostgreSQL + TypeORM                      |
| Authentification| JWT (Passport) + RBAC par rôle            |
| Validation      | class-validator / class-transformer (DTO) |
| Documentation   | Swagger (OpenAPI) auto-générée            |
| Cache (bonus)   | Redis                                     |
| Conteneurisation| Docker / docker-compose                   |
| CI              | GitHub Actions                            |
| Tests           | Jest (unitaires) + Supertest (e2e)        |

## Architecture du projet

Architecture modulaire NestJS : un module par ressource métier, chacun avec son
`entity` (TypeORM), ses `dto` (validation), son `service` (logique métier) et son
`controller` (routes HTTP).

```
src/
├── auth/            # Inscription, connexion, JWT, guards, RBAC
│   ├── decorators/  # @Roles(), @Public(), @CurrentUser()
│   ├── guards/      # JwtAuthGuard (global), RolesGuard (global)
│   ├── strategies/  # JwtStrategy (Passport)
│   └── dto/
├── users/           # Gestion des comptes (réservé ADMIN)
├── cars/            # Catalogue de véhicules (CRUD + filtres publics)
├── bookings/        # Réservations (création, statut, annulation)
├── reviews/         # Avis clients sur les véhicules
├── currency/        # Intégration API externe ExchangeRate
├── weather/         # Intégration API externe OpenWeather
├── common/          # Filtre d'erreurs global + interceptor de réponse
├── app.module.ts    # Assemblage de tous les modules
├── main.ts          # Bootstrap (Swagger, CORS, pipes, sécurité)
└── seed.ts           # Script de peuplement (admin + véhicules de démo)
```

Chaque route HTTP renvoie une réponse JSON **uniforme** grâce à
`TransformInterceptor` :

```json
{ "success": true, "statusCode": 200, "data": { ... }, "timestamp": "..." }
```

Et chaque erreur est interceptée par `HttpExceptionFilter` :

```json
{ "success": false, "statusCode": 404, "error": "Not Found", "message": "...", "path": "...", "timestamp": "..." }
```

## Modèle de données

```
User (id, email, password, firstName, lastName, phone, role, isActive)
  └─< Booking (id, userId, carId, startDate, endDate, pickupLocation,
  │           returnLocation, status, totalPrice, currency, notes)
  └─< Review  (id, userId, carId, rating, comment)

Car (id, brand, model, year, category, transmission, fuelType, seats,
     pricePerDay, currency, description, imageUrl, available, mileageLimitKm)
  └─< Booking
  └─< Review
```

`status` d'une réservation suit le cycle : `pending` → `confirmed` → `active` →
`completed`, avec `cancelled` possible à tout moment avant `completed` — ce qui
correspond aux statuts affichés sur le dashboard fourni ("Demandes en attente",
"À venir", "En cours", "Historique").

## Installation

Prérequis : Node.js ≥ 18, PostgreSQL (ou Docker), npm.

```bash
git clone <url-de-votre-repo-github>
cd car-rental-api
npm install
cp .env.example .env
# Renseignez les variables dans .env (voir section suivante)
```

## Variables d'environnement

Voir `.env.example` pour la liste complète. Les plus importantes :

- `DB_*` : connexion PostgreSQL
- `JWT_SECRET`, `JWT_EXPIRES_IN` : signature des tokens JWT
- `EXCHANGE_RATE_API_KEY` : clé gratuite sur [exchangerate-api.com](https://www.exchangerate-api.com/)
- `OPENWEATHER_API_KEY` : clé gratuite sur [openweathermap.org](https://openweathermap.org/api)
- `FRONTEND_URL` : URL du frontend autorisée par CORS

## Lancer le projet

```bash
# Mode développement (hot-reload)
npm run start:dev

# Peupler la base avec un compte admin + des véhicules de démo
npm run seed

# Build production
npm run build && npm run start:prod
```

L'API est servie sur `http://localhost:3000/api/v1`.
La documentation Swagger interactive est sur `http://localhost:3000/api/v1/docs`.

Comptes créés par le seed :
- Admin : `admin@promove.sn` / `Admin123!`
- Manager : `manager@promove.sn` / `Manager123!`

## Authentification & rôles (RBAC)

Trois rôles :

- **client** : s'inscrit lui-même, réserve des véhicules, laisse des avis, gère ses propres réservations.
- **manager** : gère le catalogue de véhicules et valide/fait évoluer les réservations.
- **admin** : tous les droits, y compris la gestion des comptes utilisateurs.

Flux :

1. `POST /auth/register` → crée un compte **client** et renvoie un `accessToken`.
2. `POST /auth/login` → authentifie et renvoie un `accessToken`.
3. Le frontend envoie ensuite ce token dans l'en-tête `Authorization: Bearer <token>`
   sur toutes les routes protégées.

Toutes les routes sont **protégées par défaut** (`JwtAuthGuard` global) ; seules
celles marquées `@Public()` dans le code sont accessibles sans authentification
(catalogue de véhicules, login/register, taux de change, météo...). Le `RolesGuard`
vérifie ensuite le rôle via `@Roles(Role.ADMIN, Role.MANAGER)` sur les routes qui
le nécessitent.

## Endpoints principaux

Toutes les routes sont préfixées par `/api/v1`. Documentation complète et testable
sur Swagger (`/api/v1/docs`).

| Méthode | Route                     | Accès              | Description                              |
|---------|----------------------------|---------------------|-------------------------------------------|
| POST    | `/auth/register`           | Public              | Créer un compte client                    |
| POST    | `/auth/login`               | Public              | Connexion, renvoie un JWT                 |
| POST    | `/auth/forgot-password`     | Public              | Demande de lien de reinitialisation       |
| GET     | `/auth/me`                  | Authentifié         | Profil de l'utilisateur connecté          |
| GET     | `/cars`                     | Public              | Catalogue avec filtres (`category`, `brand`, `minPrice`, `maxPrice`) |
| GET     | `/cars/:id`                 | Public              | Détail d'un véhicule                      |
| POST    | `/cars`                     | Admin / Manager     | Ajouter un véhicule                       |
| PATCH   | `/cars/:id`                 | Admin / Manager     | Modifier un véhicule                      |
| DELETE  | `/cars/:id`                 | Admin               | Supprimer un véhicule                     |
| POST    | `/bookings`                 | Authentifié         | Créer une réservation                     |
| GET     | `/bookings`                 | Authentifié         | Ses réservations (ou toutes pour staff)   |
| PATCH   | `/bookings/:id/status`      | Admin / Manager     | Faire évoluer le statut                   |
| PATCH   | `/bookings/:id/cancel`      | Authentifié         | Annuler sa réservation                    |
| POST    | `/reviews`                  | Authentifié         | Laisser un avis (véhicule déjà réservé)   |
| GET     | `/reviews/car/:carId`       | Public              | Avis d'un véhicule                        |
| GET     | `/currency/rates`           | Public              | Taux de change actuels                    |
| GET     | `/currency/convert`         | Public              | Convertir un montant                      |
| GET     | `/weather?city=Monaco`      | Public              | Météo d'une ville (widget dashboard)      |
| GET     | `/parking`                  | Admin / Manager     | Liste des emplacements de parking         |
| GET     | `/parking/stats`            | Admin / Manager     | Compteur libres / occupés                 |
| PATCH   | `/parking/:id/occupy`       | Admin / Manager     | Enregistrer un véhicule sur un emplacement|
| PATCH   | `/parking/:id/release`      | Admin / Manager     | Libérer un emplacement                    |
| GET     | `/metrics`                  | Public (hors préfixe)| Métriques Prometheus (monitoring)        |
| GET/POST/PATCH/DELETE `/users` | Admin       | Gestion des comptes                       |

## API externes consommées

Le frontend fourni intègre déjà deux widgets qui correspondent chacun à une API
externe gratuite branchée côté backend :

1. **ExchangeRate API** (`/currency/rates`, `/currency/convert`) → alimente le
   widget *"Taux de Change"* du dashboard (EUR/USD, EUR/GBP...) et permet de
   convertir le prix de location d'un véhicule dans la devise du client.
2. **OpenWeather** (`/weather?city=...`) → alimente le widget *"Destination
   Actuelle"* du dashboard (température, humidité, description).

## Frontend connecté

Le frontend fourni (`login.html`, `creationCompte.html`, `mdpoublie.html`, `home.html`,
`inventaire.html`, `details.html`, `dashboard.html`) a été branché sur cette API :
authentification JWT persistée en `localStorage`, catalogue et filtres dynamiques,
réservation avec calcul du total, avis clients, widgets météo/devises sur le
dashboard, déconnexion, etc. Toute la logique est centralisée dans `js/api.js`.

Pour le lancer en local à côté de l'API :

```bash
cd chemin/vers/le/frontend
python3 -m http.server 5500
# puis ouvrez http://localhost:5500/login.html
```

> Ouvrir les fichiers directement en `file://` peut être bloqué par CORS dans
> certains navigateurs — préférez un petit serveur statique comme ci-dessus.
> Si l'API tourne sur une autre URL, changez `API_BASE_URL` en haut de `js/api.js`.

Exemple d'appel utilisé par les pages (voir `js/api.js` pour le détail) :

```js
const res = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const { data } = await res.json();
localStorage.setItem('orva_token', data.accessToken);
```

## Tests

```bash
npm test          # tests unitaires (ex: cars.service.spec.ts)
npm run test:cov  # avec couverture
npm run test:e2e  # tests end-to-end (necessite une base de donnees accessible)
```

## Docker

```bash
docker compose up --build
```

Démarre l'API, PostgreSQL et Redis ensemble. L'API reste accessible sur le port
`3000`.

## CI/CD

Un pipeline GitHub Actions (`.github/workflows/ci.yml`) installe les dépendances,
lint, build et exécute les tests à chaque push/PR sur `main` et `develop`, avec un
service PostgreSQL éphémère.

## Git Flow

Organisation recommandée des branches pour ce projet :

- `main` : code stable, déployable
- `develop` : intégration des fonctionnalités
- `feature/<nom>` : une branche par fonctionnalité (ex: `feature/bookings-crud`)
- `fix/<nom>` : correctifs de bugs

Exemple de convention de commits (Conventional Commits) :

```
feat(bookings): ajoute la verification de chevauchement de dates
fix(auth): corrige l'expiration du token JWT
docs(readme): documente les routes currency et weather
```

## Bonus implémentés

- [x] Dockerisation (API + PostgreSQL + Redis + Prometheus + Grafana)
- [x] Pipeline CI/CD (GitHub Actions)
- [x] Tests unitaires (auth, users, cars, bookings) + tests End-to-End
- [x] Rate limiting basique (`@nestjs/throttler`)
- [x] Documentation Swagger complète
- [x] Script de seed pour données de démo
- [x] **Cache Redis** : les réponses de `/currency/rates` et `/weather` sont mises
      en cache 10 minutes (évite de saturer les quotas gratuits des API
      externes). Si Redis est indisponible, l'app retombe automatiquement sur
      un cache en mémoire pour ne jamais bloquer le démarrage.
- [x] **Monitoring Prometheus/Grafana** : endpoint `GET /metrics` (hors préfixe
      `/api/v1`, convention standard) exposant les métriques par défaut
      (CPU, mémoire, event loop) ainsi que des métriques HTTP personnalisées
      (nombre de requêtes et durée, par méthode/route/code de statut). Un
      `docker-compose up` démarre aussi Prometheus (`:9090`, déjà configuré
      pour scraper l'API) et Grafana (`:3001`, identifiants `admin`/`admin` —
      ajoutez Prometheus comme source de données à l'URL `http://prometheus:9090`).
- [ ] Déploiement cloud — non fait (nécessite un compte chez un hébergeur ;
      voir ci-dessous)

## Déploiement (à faire par l'équipe)

Cette partie nécessite vos propres comptes et n'a pas pu être faite depuis cet
environnement de génération de code (pas d'accès réseau externe). Pistes
gratuites recommandées :

- **Backend** : [Render](https://render.com) (Web Service + PostgreSQL managé
  gratuits) ou [Railway](https://railway.app). Variables d'environnement à
  renseigner : les mêmes que `.env.example`.
- **Frontend** : [Vercel](https://vercel.com) ou [Netlify](https://netlify.com)
  (déploiement automatique depuis GitHub, gratuit pour un projet étudiant).
  Pensez à changer `API_BASE_URL` dans `src/services/api.ts` pour pointer vers
  l'URL du backend déployé au lieu de `http://localhost:3000`.

## Pistes d'amélioration

- Rafraîchissement de token (refresh token) pour éviter la reconnexion après expiration
- Upload d'images de véhicules (au lieu d'une simple URL)
- Pagination sur `/cars` et `/bookings`
- Vraie fonctionnalité "mot de passe oublié" (actuellement seule la page frontend existe)
- Historique des paiements / intégration d'un moyen de paiement
