import axios, { AxiosInstance } from 'axios';
import { PokeApiPokemonList, PokeApiPokemon } from '../models/Pokemon';

class PokeAPIClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
  }

  async getPokemonList(offset: number, limit: number): Promise<PokeApiPokemonList> {
    const response = await this.client.get<PokeApiPokemonList>('/pokemon', {
      params: { offset, limit },
    });
    return response.data;
  }

  async getPokemonByIdOrName(idOrName: string | number): Promise<PokeApiPokemon> {
    const response = await this.client.get<PokeApiPokemon>(`/pokemon/${idOrName}`);
    return response.data;
  }

  extractIdFromUrl(url: string): number {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1]) : 0;
  }
}

export const pokeApiClient = new PokeAPIClient();