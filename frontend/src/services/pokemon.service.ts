import { apiClient } from './api';
import { Pokemon, PokemonDetail, PaginatedResponse } from '../types/pokemon';

export const pokemonService = {
  async getPokemons(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Pokemon>> {
    return apiClient.get<PaginatedResponse<Pokemon>>('/pokemons', { page, limit });
  },

  async getPokemonById(id: number): Promise<PokemonDetail> {
    return apiClient.get<PokemonDetail>(`/pokemons/${id}`);
  },
};