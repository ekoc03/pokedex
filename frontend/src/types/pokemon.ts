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