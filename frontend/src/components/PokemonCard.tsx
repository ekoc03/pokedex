import { Link } from 'react-router-dom';
import { Pokemon } from '../types/pokemon';
import { getTypeBadgeClasses } from '../utils/typeColors';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4"
    >
      <div className="text-right">
        <p className="text-gray-500 text-sm">#{pokemon.number}</p>
      </div>

      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
        <img
          src={pokemon.imageUrl}
          alt={pokemon.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-center">
        <h3 className="font-bold text-lg capitalize">{pokemon.name}</h3>
        <div className="flex gap-2 justify-center mt-2">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadgeClasses(type)}`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};