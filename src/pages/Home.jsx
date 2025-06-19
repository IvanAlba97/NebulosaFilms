import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import MovieCard from '../components/MovieCard.jsx';
import { searchMovies } from '../services/tmdbAPI.js';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Cuando el usuario busca, actualiza la URL y marca que ya buscó
  const handleSearch = (query) => {
    setSearchValue(query);
    setHasSearched(true);
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/`);
    }
  };

  // Cuando cambia la URL, actualiza el input y busca
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    setSearchValue(search);
    if (search) {
      setLoading(true);
      searchMovies(search).then(results => {
        setMovies(results);
        setLoading(false);
      });
    } else {
      setMovies([]);
      setHasSearched(false); // Reinicia el estado si no hay búsqueda
    }
    // eslint-disable-next-line
  }, [location.key, location.search]);

  // Controla la transición del mensaje de bienvenida
  useEffect(() => {
    if (searchValue) {
      setShowWelcome(false);
    } else {
      setShowWelcome(true);
    }
  }, [searchValue]);

  return (
    <div
      className="min-h-screen flex flex-col justify-center p-8 p-4 pb-24 sm:pb-8 bg-gradient-to-b from-[#102331] to-black"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #102331 50%, #000 100%)',
      }}
    >
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-[#00FFFF] mb-8 text-center cursor-pointer">
          <Link to="/">NebulosaFilms</Link>
        </h1>
        <SearchBar
          onSearch={handleSearch}
          value={searchValue}
          setValue={setSearchValue}
        />
        {/* Mensaje de bienvenida con transición */}
        <div
          className={`transition-all duration-500 ease-in-out ${showWelcome && !loading && movies.length === 0
            ? 'opacity-100 max-h-96 mb-8 mt-12'
            : 'opacity-0 max-h-0 mb-0 mt-0 pointer-events-none'
            }`}
        >
          <div className="text-center text-white max-w-xl mx-auto bg-gray-700 bg-opacity-70 rounded p-6">
            <h2 className="text-2xl font-bold mb-2 text-[#00FFFF]">¡Bienvenido!</h2>
            <p>
              Explora y busca información sobre películas, descubre detalles, reparto y tráilers. Usa la barra de búsqueda para empezar.
            </p>
          </div>
        </div>
        {loading && <p className="text-center text-gray-600">Cargando...</p>}
        {!loading && movies.length === 0 && hasSearched && (
          <p className="text-center text-gray-500">No se encontraron resultados.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4">
          {movies
            .filter(movie => movie.poster_path) // Solo películas con portada
            .map(movie => (
              <Link key={movie.id} to={`/movie/${movie.id}`}>
                <MovieCard movie={movie} />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}