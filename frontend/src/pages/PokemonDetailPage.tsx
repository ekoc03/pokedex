import { useParams, useNavigate } from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemons';
import { getTypeBadgeClasses } from '../utils/typeColors';
import { TYPE_COLORS } from '../types/pokemon';
import { ReactComponent as WeightIcon } from '../assests/images/weight.svg';
import { ReactComponent as RulerIcon } from '../assests/images/ruler.svg';

export const PokemonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pokemon, isLoading, error } = usePokemon(parseInt(id || '0'));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-600 text-xl">Pokémon not found</div>
      </div>
    );
  }

  const primaryType = pokemon.types[0];
  const typeColor = TYPE_COLORS[primaryType.toLowerCase()] || TYPE_COLORS.normal;
  const bgColorClass = typeColor.bg;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className={`${bgColorClass} min-h-[40vh]`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-white mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold capitalize">{pokemon.name}</h1>
            <span className="text-lg font-semibold">#{pokemon.number}</span>
          </div>
          <div className="flex justify-center items-center">
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              className="w-56 h-56 object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 -mt-12">
        <div className="bg-white rounded-t-3xl shadow-xl p-6 min-h-[60vh]">
          <div className="flex gap-3 justify-center mb-8">
            {pokemon.types.map((type: string) => (
              <span
                key={type}
                className={`px-6 py-2 rounded-full text-sm font-semibold capitalize ${getTypeBadgeClasses(type)}`}
              >
                {type}
              </span>
            ))}
          </div>
          <h2 className={`text-xl font-bold text-center mb-6 ${primaryType === 'grass' ? 'text-green-500' : 'text-blue-500'}`}>
            About
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <WeightIcon className="w-4 h-4 text-gray-600" />
                <span className="text-lg font-semibold">{pokemon.weight / 10} kg</span>
              </div>
              <p className="text-sm text-gray-500">Weight</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <RulerIcon className="w-5 h-4 text-gray-600 -rotate-90" />
                <span className="text-lg font-semibold">{pokemon.height / 10} m</span>
              </div>
              <p className="text-sm text-gray-500">Height</p>
            </div>
            <div>
              <div className="flex flex-col items-center mb-1">
                <span className="text-lg font-semibold capitalize">
                  {pokemon.abilities[0]?.name || 'N/A'}
                </span>
                {pokemon.abilities[1] && (
                  <span className="text-sm text-gray-600 capitalize">
                    {pokemon.abilities[1].name}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">Moves</p>
            </div>
          </div>
          <div className="mb-8">
            <h3 className={`text-lg font-bold mb-4 ${primaryType === 'grass' ? 'text-green-500' : 'text-blue-500'}`}>
              Abilities
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {pokemon.abilities.map((ability: { name: string; isHidden: boolean }, index: number) => (
                <div
                  key={index}
                  className="px-4 py-3 bg-gray-50 rounded-xl text-center border border-gray-200"
                >
                  <p className="font-medium capitalize text-gray-800">{ability.name}</p>
                  {ability.isHidden && (
                    <p className="text-xs text-gray-500 mt-1">(Hidden)</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <h3 className={`text-lg font-bold mb-4 ${primaryType === 'grass' ? 'text-green-500' : 'text-blue-500'}`}>
              Sample Moves
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {pokemon.moves.slice(0, 6).map((move: { name: string; learnMethod: string }, index: number) => (
                <div
                  key={index}
                  className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <p className="font-medium capitalize text-gray-800 text-sm">
                    {move.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize mt-1">
                    {move.learnMethod}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
