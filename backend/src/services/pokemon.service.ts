import { pokeApiClient } from '../lib/pokeapi';
import { Pokemon, PokemonDetail, PaginatedResponse } from '../models/Pokemon';

export class PokemonService {
  async getPokemons(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<PaginatedResponse<Pokemon>> {
    if (search && search.trim()) {
      return this.searchPokemons(search.trim().toLowerCase(), page, limit);
    }

    const offset = (page - 1) * limit;
    const listData = await pokeApiClient.getPokemonList(offset, limit);

    const pokemonPromises = listData.results.map(async result => {
      const id = pokeApiClient.extractIdFromUrl(result.url);
      const details = await pokeApiClient.getPokemonByIdOrName(id);
      return this.mapToBasicPokemon(details);
    });

    const pokemons = await Promise.all(pokemonPromises);

    return {
      data: pokemons,
      total: listData.count,
      page,
      limit,
      totalPages: Math.ceil(listData.count / limit),
    };
  }

  private async searchPokemons(
    searchTerm: string,
    page: number,
    limit: number
  ): Promise<PaginatedResponse<Pokemon>> {
    const allPokemonData = await pokeApiClient.getPokemonList(0, 10000);

    const matchingPokemon = allPokemonData.results.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );

    const total = matchingPokemon.length;
    const totalPages = Math.ceil(total / limit);

    const offset = (page - 1) * limit;
    const paginatedResults = matchingPokemon.slice(offset, offset + limit);

    const pokemonPromises = paginatedResults.map(async result => {
      const id = pokeApiClient.extractIdFromUrl(result.url);
      const details = await pokeApiClient.getPokemonByIdOrName(id);
      return this.mapToBasicPokemon(details);
    });

    const pokemons = await Promise.all(pokemonPromises);

    return {
      data: pokemons,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getPokemonById(id: number): Promise<PokemonDetail> {
    const data = await pokeApiClient.getPokemonByIdOrName(id);
    return this.mapToDetailedPokemon(data);
  }

  private mapToBasicPokemon(data: any): Pokemon {
    return {
      id: data.id,
      name: data.name,
      number: String(data.id).padStart(3, '0'),
      imageUrl:
        data.sprites.other?.['official-artwork']?.front_default ||
        data.sprites.front_default,
      types: data.types.map((t: any) => t.type.name),
    };
  }

  private mapToDetailedPokemon(data: any): PokemonDetail {
    return {
      ...this.mapToBasicPokemon(data),
      abilities: data.abilities.map((a: any) => ({
        name: a.ability.name,
        isHidden: a.is_hidden,
      })),
      moves: data.moves.slice(0, 10).map((m: any) => ({
        name: m.move.name,
        learnMethod: m.version_group_details[0]?.move_learn_method.name || 'unknown',
      })),
      forms: data.forms.map((f: any) => ({
        name: f.name,
        url: f.url,
      })),
      height: data.height,
      weight: data.weight,
    };
  }
}

export const pokemonService = new PokemonService();