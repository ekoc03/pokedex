export enum PokemonType {
  NORMAL = 'normal',
  FLYING = 'flying',
  WATER = 'water',
  ICE = 'ice',
  FIRE = 'fire',
  DRAGON = 'dragon',
  ELECTRIC = 'electric',
  STEEL = 'steel',
  ROCK = 'rock',
  GROUND = 'ground',
  GRASS = 'grass',
  FAIRY = 'fairy',
  PSYCHIC = 'psychic',
  FIGHTING = 'fighting',
  BUG = 'bug',
  POISON = 'poison',
  DARK = 'dark',
  GHOST = 'ghost',
}

export const TYPE_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
  normal: {
    bg: 'bg-gray-400',
    text: 'text-gray-800',
    gradient: 'from-gray-400 to-purple-300'
  },
  flying: {
    bg: 'bg-purple-400',
    text: 'text-white',
    gradient: 'from-purple-400 to-blue-300'
  },
  water: {
    bg: 'bg-blue-500',
    text: 'text-white',
    gradient: 'from-blue-500 to-blue-400'
  },
  ice: {
    bg: 'bg-cyan-300',
    text: 'text-cyan-900',
    gradient: 'from-cyan-400 to-cyan-200'
  },
  fire: {
    bg: 'bg-orange-500',
    text: 'text-white',
    gradient: 'from-orange-500 to-red-400'
  },
  dragon: {
    bg: 'bg-purple-600',
    text: 'text-white',
    gradient: 'from-purple-600 to-indigo-500'
  },
  electric: {
    bg: 'bg-yellow-400',
    text: 'text-yellow-900',
    gradient: 'from-yellow-400 to-yellow-300'
  },
  steel: {
    bg: 'bg-gray-500',
    text: 'text-white',
    gradient: 'from-gray-500 to-gray-400'
  },
  rock: {
    bg: 'bg-yellow-700',
    text: 'text-white',
    gradient: 'from-yellow-700 to-yellow-600'
  },
  ground: {
    bg: 'bg-yellow-600',
    text: 'text-white',
    gradient: 'from-yellow-600 to-yellow-500'
  },
  grass: {
    bg: 'bg-green-500',
    text: 'text-white',
    gradient: 'from-green-500 to-green-400'
  },
  fairy: {
    bg: 'bg-pink-300',
    text: 'text-pink-900',
    gradient: 'from-pink-400 to-pink-200'
  },
  psychic: {
    bg: 'bg-pink-500',
    text: 'text-white',
    gradient: 'from-pink-500 to-pink-400'
  },
  fighting: {
    bg: 'bg-red-600',
    text: 'text-white',
    gradient: 'from-red-600 to-red-500'
  },
  bug: {
    bg: 'bg-lime-500',
    text: 'text-lime-900',
    gradient: 'from-lime-500 to-green-400'
  },
  poison: {
    bg: 'bg-purple-500',
    text: 'text-white',
    gradient: 'from-purple-500 to-purple-400'
  },
  dark: {
    bg: 'bg-gray-800',
    text: 'text-white',
    gradient: 'from-gray-800 to-gray-700'
  },
  ghost: {
    bg: 'bg-purple-700',
    text: 'text-white',
    gradient: 'from-purple-700 to-purple-600'
  },
};

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