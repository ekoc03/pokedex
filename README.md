# POKEDEX 

## User Story

As a Pokémon fan, I want to log into a web app and see a list of Pokémon so I can search, sort by name or number, and search for any Pokémon. I want to click on any Pokémon to open a detail page where I can see its abilities, moves, forms, and basic info. The experience should be fast, responsive, and easy to use on any device, so I can interact with the Pokedex comfortably whether I’m on my phone or computer.

## How to Run 

**Backend**
cd backend
npm install
npm run dev

**Frontend**
cd frontend
npm install
npm start


## Prompts used to build the project: (Claude code)

**For the main structure:**
I’m building a full-stack Pokemon web app, with the following structure:
Backend: Node.js, Express, TypeScript, with three endpoints (login admin/admin, /pokemons paginated list, /pokemons/:id detail), acting as a proxy to Poke API with simple in-memory authentication
Frontend: React (use CRA), TypeScript with login, protected routes, paginated Pokemon list
Please propose a clean, scalable folder structure (no over-engineering) and keep frontend and backend separated

### What I fixed:
1. There were too many nested folders, so I simplified backend to: api/, services/, models/, lib/ and the frontend to: components/, pages/, hooks/, services/, store/, types/
2. Empty folders created
3. Over-abstraction for a small project

### For tests:
Write Jest tests for a Node.js, Express, TypeScript and a backend using Prisma that consumes the Poke API. Follow TDD, mock external HTTP calls, validate errors, ensure high coverage, and organize by folders: tests/unit and tests/integration. Do not generate implementation code until I approve the tests.


## Activity: Generative AI tools (GenAI-Output folder)
### Prompt:
Generate a REST API scaffold for a Task Management system using Node.js, Express, and TypeScript with the following requirements:
- CRUD endpoints for Task
- Each Task must include: id, title (string), description (string), status (“pending”, “in_progress”, “done”), due_date (type date), userId (number)
- Assume a basic User model exists
- Include validation for input fields
- Use a lightweight database (SQLite) with Prisma 
- Add basic authentication middleware just to check if a user is logged in, no full auth flow required
- Ensure the code is easy to test and follows clean folder structure

### How I reviewed and refined output
1. Validated AI suggestions: I checked the generated routes, controllers, and services against the requirements to ensure correct field types, CRUD coverage, and proper folder structure.
2. Corrections & improvements: I adjusted validation logic, refined error handling, and ensured status fields and date formats were properly constrained.
3. Edge cases: I added some checks for missing fields, invalid IDs, unauthorized access.
4. Performance & idiomatic quality: I reviewed queries for unnecessary work, removed redundant logic.
