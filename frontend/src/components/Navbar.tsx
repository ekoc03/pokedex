import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-red-500 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Pokédex</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-white">Welcome, {user.username}!</span>
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};