import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePokemons } from '../hooks/usePokemons';
import { PokemonCard } from '../components/PokemonCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Navbar } from '../components/Navbar';

export const PokemonListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<'name' | 'number'>('number');

  const page = parseInt(searchParams.get('page') || '1');
  const searchFilter = searchParams.get('search') || '';

  useEffect(() => {
    setSearchQuery(searchFilter);
  }, [searchFilter]);

  useEffect(() => {
    if (searchQuery === searchFilter) return;

    const timer = setTimeout(() => {
      const params: Record<string, string> = {};
      if (searchQuery) {
        params.search = searchQuery;
      }
      setSearchParams(params);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchFilter, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    const params: Record<string, string> = {};
    if (newPage > 1) params.page = newPage.toString();
    if (searchFilter) params.search = searchFilter;
    setSearchParams(params);
  };

  const { data, isLoading, error } = usePokemons(page, 20, searchFilter);

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
          <SearchBar onSearch={setSearchQuery} value={searchQuery} />
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSortBy('number')}
              className={`px-4 py-2 rounded-lg ${sortBy === 'number'
                ? 'bg-red-300 text-white'
                : 'bg-red-500 text-white'
                }`}
            >
              Sort by Number
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-4 py-2 rounded-lg ${sortBy === 'name'
                ? 'bg-red-300 text-white'
                : 'bg-red-500 text-white'
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
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};