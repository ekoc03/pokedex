export type PokemonType =
	| "normal"
	| "flying"
	| "water"
	| "ice"
	| "fire"
	| "dragon"
	| "electric"
	| "steel"
	| "rock"
	| "ground"
	| "grass"
	| "fairy"
	| "psychic"
	| "fighting"
	| "bug"
	| "poison"
	| "dark"
	| "ghost";

export const TYPE_COLORS: Record<string, { bg: string; text: string; }> = {
	normal: {
		bg: 'bg-gray-300',
		text: 'text-gray-800',
	},
	flying: {
		bg: 'bg-purple-400',
		text: 'text-white',
	},
	water: {
		bg: 'bg-blue-500',
		text: 'text-white',
	},
	ice: {
		bg: 'bg-cyan-300',
		text: 'text-cyan-900',
	},
	fire: {
		bg: 'bg-orange-500',
		text: 'text-white',
	},
	dragon: {
		bg: 'bg-purple-600',
		text: 'text-white',
	},
	electric: {
		bg: 'bg-yellow-400',
		text: 'text-yellow-900',
	},
	steel: {
		bg: 'bg-gray-500',
		text: 'text-white',
	},
	rock: {
		bg: 'bg-yellow-700',
		text: 'text-white',
	},
	ground: {
		bg: 'bg-yellow-600',
		text: 'text-white',
	},
	grass: {
		bg: 'bg-green-500',
		text: 'text-white',
	},
	fairy: {
		bg: 'bg-pink-300',
		text: 'text-pink-900',
	},
	psychic: {
		bg: 'bg-pink-500',
		text: 'text-white',
	},
	fighting: {
		bg: 'bg-red-600',
		text: 'text-white',
	},
	bug: {
		bg: 'bg-lime-500',
		text: 'text-lime-900',
	},
	poison: {
		bg: 'bg-purple-500',
		text: 'text-white',
	},
	dark: {
		bg: 'bg-gray-800',
		text: 'text-white',
	},
	ghost: {
		bg: 'bg-purple-700',
		text: 'text-white',
	},
};

export interface Pokemon {
	id: number;
	name: string;
	number: string;
	imageUrl: string;
	types: PokemonType[];
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