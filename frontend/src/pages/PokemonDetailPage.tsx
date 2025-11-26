import { useParams, useNavigate } from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemons';
import { Navbar } from '../components/Navbar';

export const PokemonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pokemon, isLoading, error } = usePokemon(parseInt(id || '0'));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Pokémon not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
        >
          ← Back to List
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-lg">#{pokemon.number}</p>
            <h1 className="text-4xl font-bold capitalize mb-4">{pokemon.name}</h1>
            <div className="flex gap-2 justify-center">
              {pokemon.types.map((type: string) => (
                <span
                  key={type}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center mb-8">
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              className="w-64 h-64 object-contain"
            />
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-gray-600">Height</p>
              <p className="text-xl font-semibold">{pokemon.height / 10} m</p>
            </div>
            <div>
              <p className="text-gray-600">Weight</p>
              <p className="text-xl font-semibold">{pokemon.weight / 10} kg</p>
            </div>
          </div>

          {/* Abilities */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Abilities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pokemon.abilities.map((ability: { name: string; isHidden: boolean }, index: number) => (
                <div
                  key={index}
                  className="px-4 py-3 bg-purple-50 rounded-lg text-center"
                >
                  <p className="font-medium capitalize">{ability.name}</p>
                  {ability.isHidden && (
                    <p className="text-xs text-gray-500">(Hidden)</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Moves */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Sample Moves</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pokemon.moves.map((move: { name: string; learnMethod: string }, index: number) => (
                <div key={index} className="px-4 py-3 bg-green-50 rounded-lg">
                  <p className="font-medium capitalize">{move.name}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {move.learnMethod}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Forms */}
          {pokemon.forms.length > 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Forms</h2>
              <div className="flex gap-3 flex-wrap">
                {pokemon.forms.map((form: { name: string; url: string }, index: number) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-orange-50 rounded-lg capitalize"
                  >
                    {form.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
