import { useQuery } from '@tanstack/react-query';
import { pokemonService } from '../services/pokemon.service';

export const usePokemons = (page: number = 1, limit: number = 20, search?: string) => {
  return useQuery({
    queryKey: ['pokemons', page, limit, search],
    queryFn: () => pokemonService.getPokemons(page, limit, search),
  });
};

export const usePokemon = (id: number) => {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => pokemonService.getPokemonById(id),
    enabled: !!id,
  });
};