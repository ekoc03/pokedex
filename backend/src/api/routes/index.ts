import { Router } from 'express';
import authRoutes from './auth.routes';
import pokemonRoutes from './pokemon.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/pokemons', pokemonRoutes);

export default router;