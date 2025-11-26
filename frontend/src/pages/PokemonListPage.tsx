import { useState, useMemo, useEffect } from 'react';
import { usePokemons } from '../hooks/usePokemons';
import { PokemonCard } from '../components/PokemonCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Navbar } from '../components/Navbar';

export const PokemonListPage = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'number'>('number');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); 
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error } = usePokemons(page, 20, debouncedSearch);

  const sortedPokemons = useMemo(() => {
    if (!data) return [];

    let pokemons = [...data.data];

    pokemons.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return parseInt(a.number) - parseInt(b.number);
    });

    return pokemons;
  }, [data, sortBy]);

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
        <div className="mb-8 space-y-4">
          <SearchBar onSearch={setSearchQuery} />

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSortBy('number')}
              className={`px-4 py-2 rounded-lg ${
                sortBy === 'number'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Sort by Number
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-4 py-2 rounded-lg ${
                sortBy === 'name'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Sort by Name
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <>
            {sortedPokemons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No Pokémon matching your search
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sortedPokemons.map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                  ))}
                </div>
              </>
            )}

            {data && data.totalPages > 1 && (
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