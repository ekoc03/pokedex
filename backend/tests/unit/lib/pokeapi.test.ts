import axios, { AxiosInstance } from 'axios';
import { pokeApiClient } from '../../../src/lib/pokeapi';
import { mockPokemonList, mockPokemonDetail } from '../../mocks/pokeapi.mock';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create a mock axios instance
const mockAxiosInstance = {
  get: jest.fn(),
} as unknown as AxiosInstance;

// Setup axios.create to return our mock instance
mockedAxios.create.mockReturnValue(mockAxiosInstance);

describe('PokeAPIClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPokemonList', () => {
    it('should fetch pokemon list with correct params', async () => {
      // Arrange
      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({ data: mockPokemonList });

      // Act
      const result = await pokeApiClient.getPokemonList(0, 20);

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pokemon', {
        params: { offset: 0, limit: 20 },
      });
      expect(result).toEqual(mockPokemonList);
      expect(result.count).toBe(1302);
      expect(result.results).toHaveLength(3);
    });

    it('should handle pagination correctly', async () => {
      // Arrange
      const paginatedList = { ...mockPokemonList, previous: 'prev-url' };
      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({ data: paginatedList });

      // Act
      const result = await pokeApiClient.getPokemonList(20, 20);

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pokemon', {
        params: { offset: 20, limit: 20 },
      });
      expect(result.previous).toBe('prev-url');
    });

    it('should throw error when API call fails', async () => {
      // Arrange
      (mockAxiosInstance.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Act & Assert
      await expect(pokeApiClient.getPokemonList(0, 20)).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('timeout of 10000ms exceeded');
      (mockAxiosInstance.get as jest.Mock).mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(pokeApiClient.getPokemonList(0, 20)).rejects.toThrow('timeout');
    });
  });

  describe('getPokemonByIdOrName', () => {
    it('should fetch pokemon by ID', async () => {
      // Arrange
      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({ data: mockPokemonDetail });

      // Act
      const result = await pokeApiClient.getPokemonByIdOrName(1);

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pokemon/1');
      expect(result).toEqual(mockPokemonDetail);
      expect(result.id).toBe(1);
      expect(result.name).toBe('bulbasaur');
    });

    it('should fetch pokemon by name', async () => {
      // Arrange
      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({ data: mockPokemonDetail });

      // Act
      const result = await pokeApiClient.getPokemonByIdOrName('bulbasaur');

      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pokemon/bulbasaur');
      expect(result.name).toBe('bulbasaur');
    });

    it('should throw error for non-existent pokemon', async () => {
      // Arrange
      const notFoundError = {
        response: { status: 404, data: { error: 'Not Found' } },
      };
      (mockAxiosInstance.get as jest.Mock).mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(pokeApiClient.getPokemonByIdOrName(99999)).rejects.toMatchObject({
        response: { status: 404 },
      });
    });

    it('should handle malformed responses', async () => {
      // Arrange
      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({ data: null });

      // Act
      const result = await pokeApiClient.getPokemonByIdOrName(1);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('extractIdFromUrl', () => {
    it('should extract ID from valid URL', () => {
      // Act
      const id = pokeApiClient.extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/1/');

      // Assert
      expect(id).toBe(1);
    });

    it('should extract ID from URL with different numbers', () => {
      // Act
      const id = pokeApiClient.extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/');

      // Assert
      expect(id).toBe(25);
    });

    it('should extract ID from URL with large numbers', () => {
      // Act
      const id = pokeApiClient.extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/1302/');

      // Assert
      expect(id).toBe(1302);
    });

    it('should return 0 for invalid URL', () => {
      // Act
      const id = pokeApiClient.extractIdFromUrl('invalid-url');

      // Assert
      expect(id).toBe(0);
    });

    it('should return 0 for URL without ID', () => {
      // Act
      const id = pokeApiClient.extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/');

      // Assert
      expect(id).toBe(0);
    });

    it('should return 0 for empty string', () => {
      // Act
      const id = pokeApiClient.extractIdFromUrl('');

      // Assert
      expect(id).toBe(0);
    });
  });
});
