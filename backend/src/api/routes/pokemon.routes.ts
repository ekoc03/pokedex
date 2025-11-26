import { Router } from 'express';
import { pokemonController } from '../controllers/pokemon.controller';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res) => pokemonController.getPokemons(req as AuthRequest, res));
router.get('/:id', (req, res) => pokemonController.getPokemonById(req as AuthRequest, res));

export default router;