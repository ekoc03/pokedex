import { apiClient } from './api';
import { Pokemon, PokemonDetail, PaginatedResponse } from '../types/pokemon';

export const pokemonService = {
  async getPokemons(page: number = 1, limit: number = 20, search?: string): Promise<PaginatedResponse<Pokemon>> {
    const params: any = { page, limit };
    if (search && search.trim()) {
      params.search = search.trim();
    }
    return apiClient.get<PaginatedResponse<Pokemon>>('/pokemons', params);
  },

  async getPokemonById(id: number): Promise<PokemonDetail> {
    return apiClient.get<PokemonDetail>(`/pokemons/${id}`);
  },
};