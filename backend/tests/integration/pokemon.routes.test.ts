import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/index';
import { pokeApiClient } from '../../src/lib/pokeapi';
import { mockPokemonList, mockPokemonDetail, mockPikachuDetail } from '../mocks/pokeapi.mock';

jest.mock('../../src/lib/pokeapi');
const mockedPokeApiClient = pokeApiClient as jest.Mocked<typeof pokeApiClient>;

const validToken = 'Bearer valid-test-token';

jest.mock('../../src/api/middleware/auth.middleware', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    if (req.headers.authorization === validToken) {
      req.user = { id: 1, username: 'testuser' };
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },
  AuthRequest: {},
}));

describe('Pokemon Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/pokemons', () => {
    it('should return 401 without authentication', async () => {
      // Act
      const response = await request(app).get('/api/pokemons');

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should return paginated pokemon list with valid auth', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);
      mockedPokeApiClient.extractIdFromUrl.mockReturnValue(1);
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const response = await request(app)
        .get('/api/pokemons')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should accept page and limit query parameters', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);
      mockedPokeApiClient.extractIdFromUrl.mockReturnValue(1);
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const response = await request(app)
        .get('/api/pokemons?page=2&limit=10')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.page).toBe(2);
      expect(response.body.limit).toBe(10);
      expect(mockedPokeApiClient.getPokemonList).toHaveBeenCalledWith(10, 10);
    });

    it('should use default values when page and limit not provided', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);
      mockedPokeApiClient.extractIdFromUrl.mockReturnValue(1);
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const response = await request(app)
        .get('/api/pokemons')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(20);
      expect(mockedPokeApiClient.getPokemonList).toHaveBeenCalledWith(0, 20);
    });

    it('should handle search query parameter', async () => {
      // Arrange
      const searchResults = {
        ...mockPokemonList,
        results: [
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        ],
      };
      mockedPokeApiClient.getPokemonList.mockResolvedValue(searchResults);
      mockedPokeApiClient.extractIdFromUrl.mockReturnValue(25);
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPikachuDetail);

      // Act
      const response = await request(app)
        .get('/api/pokemons?search=pika')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return 500 on server error', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockRejectedValue(new Error('Database error'));

      // Act
      const response = await request(app)
        .get('/api/pokemons')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Failed to fetch pokemons');
    });

    it('should handle invalid page numbers', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);
      mockedPokeApiClient.extractIdFromUrl.mockReturnValue(1);
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const response = await request(app)
        .get('/api/pokemons?page=abc')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.page).toBe(1); // Should default to 1
    });

    it('should handle invalid limit values', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);
      mockedPokeApiClient.extractIdFromUrl.mockReturnValue(1);
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const response = await request(app)
        .get('/api/pokemons?limit=invalid')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(20); // Should default to 20
    });

    it('should return correct content type', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonList.mockResolvedValue(mockPokemonList);
      mockedPokeApiClient.extractIdFromUrl.mockReturnValue(1);
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const response = await request(app)
        .get('/api/pokemons')
        .set('Authorization', validToken);

      // Assert
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('GET /api/pokemons/:id', () => {
    it('should return 401 without authentication', async () => {
      // Act
      const response = await request(app).get('/api/pokemons/1');

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });

    it('should return pokemon detail with valid ID', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const response = await request(app)
        .get('/api/pokemons/1')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'bulbasaur');
      expect(response.body).toHaveProperty('types');
      expect(response.body).toHaveProperty('abilities');
      expect(response.body).toHaveProperty('moves');
      expect(response.body).toHaveProperty('forms');
      expect(response.body).toHaveProperty('height');
      expect(response.body).toHaveProperty('weight');
    });

    it('should return 400 for invalid pokemon ID', async () => {
      // Act
      const response = await request(app)
        .get('/api/pokemons/invalid')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid pokemon ID');
    });

    it('should return 404 for non-existent pokemon', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockRejectedValue(new Error('Not found'));

      // Act
      const response = await request(app)
        .get('/api/pokemons/99999')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Pokemon not found');
    });

    it('should handle different pokemon IDs', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPikachuDetail);

      // Act
      const response = await request(app)
        .get('/api/pokemons/25')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 25);
      expect(response.body).toHaveProperty('name', 'pikachu');
    });

    it('should return correct content type', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(mockPokemonDetail);

      // Act
      const response = await request(app)
        .get('/api/pokemons/1')
        .set('Authorization', validToken);

      // Assert
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should handle API timeout errors', async () => {
      // Arrange
      mockedPokeApiClient.getPokemonByIdOrName.mockRejectedValue(
        new Error('timeout of 10000ms exceeded')
      );

      // Act
      const response = await request(app)
        .get('/api/pokemons/1')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(404);
    });
  });

  describe('Error handling', () => {
    it('should return 404 for non-existent routes', async () => {
      // Act
      const response = await request(app)
        .get('/api/nonexistent')
        .set('Authorization', validToken);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });

    it('should handle malformed JSON responses gracefully', async () => {
      mockedPokeApiClient.getPokemonByIdOrName.mockResolvedValue(null as any);

      const response = await request(app)
        .get('/api/pokemons/1')
        .set('Authorization', validToken);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Pokemon not found');
    });
  });
});
