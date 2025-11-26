export interface Pokemon {
    id: number;
    name: string;
    number: string;
    imageUrl: string;
    types: string[];
  }
  
  export interface PokemonDetail extends Pokemon {
    abilities: Array<{
      name: string;
      isHidden: boolean;
    }>;
    moves: Array<{
      name: string;
      learnMethod: string;
    }>;
    forms: Array<{
      name: string;
      url: string;
    }>;
    height: number;
    weight: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  // Response de PokeAPI (raw)
  export interface PokeApiPokemonList {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<{
      name: string;
      url: string;
    }>;
  }
  
  export interface PokeApiPokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: {
      front_default: string;
      other?: {
        'official-artwork'?: {
          front_default: string;
        };
      };
    };
    types: Array<{
      slot: number;
      type: {
        name: string;
        url: string;
      };
    }>;
    abilities: Array<{
      ability: {
        name: string;
        url: string;
      };
      is_hidden: boolean;
      slot: number;
    }>;
    moves: Array<{
      move: {
        name: string;
        url: string;
      };
      version_group_details: Array<{
        level_learned_at: number;
        move_learn_method: {
          name: string;
          url: string;
        };
      }>;
    }>;
    forms: Array<{
      name: string;
      url: string;
    }>;
  }
  