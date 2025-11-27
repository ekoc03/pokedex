# Prompts used to build the project: (Claude code)

**For the main structure:**
I’m building a full-stack Pokemon web app, with the following structure:
Backend: Node.js, Express, TypeScript, with three endpoints (login admin/admin, /pokemons paginated list, /pokemons/:id detail), acting as a proxy to Poke API with simple in-memory auth.
Frontend: React (use CRA), TypeScript with login, protected routes, paginated Pokémon list (search and sort)
Please propose a clean, scalable folder structure (no over-engineering) and keep frontend and backend separated.
*What I fixed:*
1. There were too many nested folders, so I simplified backend to: api/, services/, models/, lib/ and the frontend to: components/, pages/, hooks/, services/, store/, types/
2. Empty folders created
3. Over-abstraction for a small project

**For tests:**
Write Jest tests for a Node.js, Express, TypeScript and a backend using Prisma that consumes the PokeA PI. Follow TDD, mock external HTTP calls, validate errors, ensure high coverage, and organize by folders: tests/unit and tests/integration. Do not generate implementation code until I approve the tests.

