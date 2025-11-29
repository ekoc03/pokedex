import { useAuth } from '../hooks/useAuth';
import { ReactComponent as PokeballIcon } from '../assests/images/pokeball.svg';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-red-500 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="container flex items-center gap-2">
          <PokeballIcon className="w-6 fill-white" />
          <a href='/' className="text-2xl font-bold text-white">Pokédex</a>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-white w-max">Welcome, {user.username}!</span>
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