import { Link } from 'react-router-dom';
import { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4"
    >
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
        <img
          src={pokemon.imageUrl}
          alt={pokemon.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-center">
        <p className="text-gray-500 text-sm">#{pokemon.number}</p>
        <h3 className="font-bold text-lg capitalize">{pokemon.name}</h3>
        <div className="flex gap-2 justify-center mt-2">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};