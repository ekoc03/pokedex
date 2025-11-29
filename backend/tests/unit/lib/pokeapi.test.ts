import axios, { AxiosInstance } from 'axios';
import { mockPokemonList, mockPokemonDetail } from '../../mocks/pokeapi.mock';

const mockAxiosInstance = {
  get: jest.fn(),
} as unknown as AxiosInstance;

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
}));

import { pokeApiClient } from '../../../src/lib/pokeapi';

describe('PokeAPIClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPokemonList', () => {
    it('should fetch pokemon list with correct params', async () => {
      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({ data: mockPokemonList });

      const result = await pokeApiClient.getPokemonList(0, 20);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pokemon', {
        params: { offset: 0, limit: 20 },
      });
      expect(result).toEqual(mockPokemonList);
      expect(result.count).toBe(1302);
      expect(result.results).toHaveLength(3);
    });

    it('should handle pagination correctly', async () => {
      const paginatedList = { ...mockPokemonList, previous: 'prev-url' };
      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({ data: paginatedList });

      const result = await pokeApiClient.getPokemonList(20, 20);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pokemon', {
        params: { offset: 20, limit: 20 },
      });
      expect(result.previous).toBe('prev-url');
    });

    it('should throw error when API call fails', async () => {
      (mockAxiosInstance.get as jest.Mock).mockRejectedValue(new Error('Network error'));
      await expect(pokeApiClient.getPokemonList(0, 20)).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('timeout of 10000ms exceeded');
      (mockAxiosInstance.get as jest.Mock).mockRejectedValue(timeoutError);
      await expect(pokeApiClient.getPokemonList(0, 20)).rejects.toThrow('timeout');
    });
  });

  describe('getPokemonByIdOrName', () => {
    it('should fetch pokemon by ID', async () => {
      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({ data: mockPokemonDetail });

      const result = await pokeApiClient.getPokemonByIdOrName(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pokemon/1');
      expect(result).toEqual(mockPokemonDetail);
      expect(result.id).toBe(1);
      expect(result.name).toBe('bulbasaur');
    });

    it('should fetch pokemon by name', async () => {
      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({ data: mockPokemonDetail });

      const result = await pokeApiClient.getPokemonByIdOrName('bulbasaur');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/pokemon/bulbasaur');
      expect(result.name).toBe('bulbasaur');
    });

    it('should throw error for non-existent pokemon', async () => {
      const notFoundError = {
        response: { status: 404, data: { error: 'Not Found' } },
      };
      (mockAxiosInstance.get as jest.Mock).mockRejectedValue(notFoundError);

      await expect(pokeApiClient.getPokemonByIdOrName(99999)).rejects.toMatchObject({
        response: { status: 404 },
      });
    });

    it('should handle malformed responses', async () => {
      (mockAxiosInstance.get as jest.Mock).mockResolvedValue({ data: null });

      const result = await pokeApiClient.getPokemonByIdOrName(1);
      expect(result).toBeNull();
    });
  });

  describe('extractIdFromUrl', () => {
    it('should extract ID from valid URL', () => {
      const id = pokeApiClient.extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/1/');

      expect(id).toBe(1);
    });

    it('should extract ID from URL with different numbers', () => {
      const id = pokeApiClient.extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/');

      expect(id).toBe(25);
    });

    it('should extract ID from URL with large numbers', () => {
      const id = pokeApiClient.extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/1302/');

      expect(id).toBe(1302);
    });

    it('should return 0 for invalid URL', () => {
      const id = pokeApiClient.extractIdFromUrl('invalid-url');

      expect(id).toBe(0);
    });

    it('should return 0 for URL without ID', () => {
      const id = pokeApiClient.extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/');

      expect(id).toBe(0);
    });

    it('should return 0 for empty string', () => {
      const id = pokeApiClient.extractIdFromUrl('');

       expect(id).toBe(0);
    });
  });
});
