import { pokemonService } from '../../../src/services/pokemon.service';
import { pokeApiClient } from '../../../src/lib/pokeapi';
import { mockPokemonList, mockPokemonDetail, mockPikachuDetail } from '../../mocks/pokeapi.mock';

// Mock the PokeAPI client
jest.mock('../../../src/lib/pokeapi');
const mockedPokeApiClient = pokeApiClient as jest.Mocked<typeof pokeApiClient>;

describe('PokemonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPokemons', () => {
    it('should return paginated pokemon list', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);
      mockedPokeApiClient.extractIdFromUrl.mockImplementation((url) => {
        const match = url.match(/\/pokemon\/(\d+)\//);
        return match ? parseInt(match[1]) : 0;
      });
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const result = await pokemonService.getPokemons(1, 20);

      // Assert
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total', 1302);
      expect(result).toHaveProperty('page', 1);
      expect(result).toHaveProperty('limit', 20);
      expect(result).toHaveProperty('totalPages', 66);
      expect(mockedPokeApiClient.getPokemonList).toHaveBeenCalledWith(0, 20);
    });

    it('should handle different page numbers correctly', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);
      mockedPokeApiClient.extractIdFromUrl.mockReturnValue(1);
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const result = await pokemonService.getPokemons(3, 10);

      // Assert
      expect(mockedPokeApiClient.getPokemonList).toHaveBeenCalledWith(20, 10);
      expect(result.page).toBe(3);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(131);
    });

    it('should map pokemon data correctly', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);
      mockedPokeApiClient.extractIdFromUrl.mockReturnValue(1);
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const result = await pokemonService.getPokemons(1, 20);

      // Assert
      const firstPokemon = result.data[0];
      expect(firstPokemon).toHaveProperty('id');
      expect(firstPokemon).toHaveProperty('name');
      expect(firstPokemon).toHaveProperty('number');
      expect(firstPokemon).toHaveProperty('imageUrl');
      expect(firstPokemon).toHaveProperty('types');
      expect(Array.isArray(firstPokemon.types)).toBe(true);
    });

    it('should handle search term - filter by name', async () => {
      // Arrange
      const allPokemonList = {
        ...mockPokemonList,
        results: [
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
          { name: 'pikachu-rock-star', url: 'https://pokeapi.co/api/v2/pokemon/10080/' },
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        ],
      };
      mockedPokeApiClient.getPokemonList.mockResolvedValue(allPokemonList);
      mockedPokeApiClient.extractIdFromUrl.mockImplementation((url) => {
        if (url.includes('/25/')) return 25;
        if (url.includes('/10080/')) return 10080;
        return 1;
      });
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPikachuDetail);

      // Act
      const result = await pokemonService.getPokemons(1, 20, 'pika');

      // Assert
      expect(result.total).toBe(2); // Only pikachu and pikachu-rock-star
      expect(result.data).toHaveLength(2);
    });

    it('should handle search with no results', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);

      // Act
      const result = await pokemonService.getPokemons(1, 20, 'nonexistent');

      // Assert
      expect(result.total).toBe(0);
      expect(result.data).toHaveLength(0);
      expect(result.totalPages).toBe(0);
    });

    it('should handle search pagination correctly', async () => {
      // Arrange
      const searchResults = {
        ...mockPokemonList,
        results: Array(50)
          .fill(null)
          .map((_, i) => ({
            name: `pika-variant-${i}`,
            url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
          })),
      };
      mockedPokeApiClient.getPokemonList.mockResolvedValue(searchResults);
      mockedPokeApiClient.extractIdFromUrl.mockReturnValue(25);
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPikachuDetail);

      // Act
      const result = await pokemonService.getPokemons(2, 20, 'pika');

      // Assert
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.data.length).toBeLessThanOrEqual(20);
      expect(result.totalPages).toBe(3); // 50 results / 20 per page
    });

    it('should handle API errors gracefully', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockRejectedValue(new Error('API Error'));

      // Act & Assert
      await expect(pokemonService.getPokemons(1, 20)).rejects.toThrow('API Error');
    });

    it('should fetch details for all pokemon in parallel', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);
      mockedPokeApiClient.extractIdFromUrl.mockImplementation((url) => {
        const match = url.match(/\/pokemon\/(\d+)\//);
        return match ? parseInt(match[1]) : 0;
      });
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      await pokemonService.getPokemons(1, 20);

      // Assert
      expect(mockedPokeApiClient.getPokemonByIdOrName).toHaveBeenCalledTimes(3);
    });
  });

  describe('getPokemonById', () => {
    it('should return pokemon detail by ID', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const result = await pokemonService.getPokemonById(1);

      // Assert
      expect(mockedPokeApiClient.getPokemonByIdOrName).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
      expect(result.name).toBe('bulbasaur');
      expect(result).toHaveProperty('abilities');
      expect(result).toHaveProperty('moves');
      expect(result).toHaveProperty('forms');
      expect(result).toHaveProperty('height');
      expect(result).toHaveProperty('weight');
    });

    it('should map abilities correctly', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const result = await pokemonService.getPokemonById(1);

      // Assert
      expect(result.abilities).toHaveLength(2);
      expect(result.abilities[0]).toHaveProperty('name', 'overgrow');
      expect(result.abilities[0]).toHaveProperty('isHidden', false);
      expect(result.abilities[1]).toHaveProperty('name', 'chlorophyll');
      expect(result.abilities[1]).toHaveProperty('isHidden', true);
    });

    it('should limit moves to 10', async () => {
      // Arrange
      const pokemonWithManyMoves = {
        ...mockPokemonDetail,
        moves: Array(50)
          .fill(null)
          .map((_, i) => ({
            move: { name: `move-${i}`, url: `url-${i}` },
            version_group_details: mockPokemonDetail.moves[0].version_group_details,
          })),
      };
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(pokemonWithManyMoves);

      // Act
      const result = await pokemonService.getPokemonById(1);

      // Assert
      expect(result.moves).toHaveLength(10);
    });

    it('should map moves with learn method correctly', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const result = await pokemonService.getPokemonById(1);

      // Assert
      expect(result.moves[0]).toHaveProperty('name', 'razor-wind');
      expect(result.moves[0]).toHaveProperty('learnMethod', 'egg');
    });

    it('should handle moves with missing learn method', async () => {
      // Arrange
      const pokemonWithIncompleteMoves = {
        ...mockPokemonDetail,
        moves: [
          {
            move: { name: 'test-move', url: 'url' },
            version_group_details: [],
          },
        ],
      };
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(pokemonWithIncompleteMoves);

      // Act
      const result = await pokemonService.getPokemonById(1);

      // Assert
      expect(result.moves[0].learnMethod).toBe('unknown');
    });

    it('should map forms correctly', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const result = await pokemonService.getPokemonById(1);

      // Assert
      expect(result.forms).toHaveLength(1);
      expect(result.forms[0]).toHaveProperty('name', 'bulbasaur');
      expect(result.forms[0]).toHaveProperty('url');
    });

    it('should use official artwork when available', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const result = await pokemonService.getPokemonById(1);

      // Assert
      expect(result.imageUrl).toContain('official-artwork');
    });

    it('should fallback to front_default sprite when official artwork unavailable', async () => {
      // Arrange
      const pokemonWithoutArtwork = {
        ...mockPokemonDetail,
        sprites: {
          front_default: 'https://sprite-url.png',
          other: {},
        },
      };
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(pokemonWithoutArtwork);

      // Act
      const result = await pokemonService.getPokemonById(1);

      // Assert
      expect(result.imageUrl).toBe('https://sprite-url.png');
    });

    it('should format pokemon number with leading zeros', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const result = await pokemonService.getPokemonById(1);

      // Assert
      expect(result.number).toBe('001');
    });

    it('should handle three-digit pokemon numbers', async () => {
      // Arrange
      const pokemon100 = { ...mockPokemonDetail, id: 100 };
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(pokemon100);

      // Act
      const result = await pokemonService.getPokemonById(100);

      // Assert
      expect(result.number).toBe('100');
    });

    it('should throw error when pokemon not found', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockRejectedValue(new Error('Not Found'));

      // Act & Assert
      await expect(pokemonService.getPokemonById(99999)).rejects.toThrow('Not Found');
    });
  });
});
