import { useQuery } from '@tanstack/react-query';
import { pokemonService } from '../services/pokemon.service';

export const usePokemons = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['pokemons', page, limit],
    queryFn: () => pokemonService.getPokemons(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePokemon = (id: number) => {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => pokemonService.getPokemonById(id),
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
};