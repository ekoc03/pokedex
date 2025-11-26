import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { pokemonService } from '../../services/pokemon.service';

export class PokemonController {
  async getPokemons(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;

      const result = await pokemonService.getPokemons(page, limit, search);
      res.json(result);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
      res.status(500).json({ error: 'Failed to fetch pokemons' });
    }
  }

  async getPokemonById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid pokemon ID' });
        return;
      }

      const pokemon = await pokemonService.getPokemonById(id);
      res.json(pokemon);
    } catch (error) {
      console.error('Error fetching pokemon:', error);
      res.status(404).json({ error: 'Pokemon not found' });
    }
  }
}

export const pokemonController = new PokemonController();