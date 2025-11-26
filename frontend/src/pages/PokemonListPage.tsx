import { useState, useMemo } from 'react';
import { usePokemons } from '../hooks/usePokemons';
import { PokemonCard } from '../components/PokemonCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Navbar } from '../components/Navbar';

export const PokemonListPage = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'number'>('number');

  const { data, isLoading, error } = usePokemons(page, 20);

  const filteredAndSortedPokemons = useMemo(() => {
    if (!data) return [];

    let pokemons = [...data.data];

    if (searchQuery) {
      pokemons = pokemons.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    pokemons.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return parseInt(a.number) - parseInt(b.number);
    });

    return pokemons;
  }, [data, searchQuery, sortBy]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading Pokémon</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Search and Sort */}
        <div className="mb-8 space-y-4">
          <SearchBar onSearch={setSearchQuery} />

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSortBy('number')}
              className={`px-4 py-2 rounded-lg ${
                sortBy === 'number'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Sort by Number
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-4 py-2 rounded-lg ${
                sortBy === 'name'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Sort by Name
            </button>
          </div>
        </div>

        {/* Pokemon Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAndSortedPokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>

            {data && (
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};