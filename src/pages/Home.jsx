import { useState, useEffect, useRef } from 'react';
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
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef();

  // Cuando el usuario busca, actualiza la URL y marca que ya buscó
  const handleSearch = (query) => {
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
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
      setHasSearched(false);
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

  // Header fijo solo en móvil y solo cuando el input está enfocado
  const headerFixed = searchFocused && window.innerWidth < 640;

  return (
    <div
      className={`min-h-screen flex flex-col justify-center p-6 pb-24 sm:pb-8 bg-gradient-to-b from-[#102331] to-black overflow-x-hidden`}
      style={{
        backgroundImage: 'radial-gradient(circle at center, #102331 50%, #000 100%)',
        paddingTop: headerFixed ? '4.5rem' : undefined,
      }}
    >
      <div
        className={`
          w-full z-20
          ${headerFixed ? 'fixed top-0 left-0 right-0 bg-[#102331] bg-opacity-95 backdrop-blur-md' : 'static'}
          sm:static sm:bg-transparent sm:backdrop-blur-0
          transition-all duration-300
        `}
        style={{
          maxWidth: '100vw',
        }}
      >
        <div className="max-w-5xl mx-auto px-2 pt-4 w-full">
          <h1 className="text-4xl sm:text-4xl font-bold text-[#00FFFF] mb-2 text-center cursor-pointer whitespace-pre-line break-words">
            <Link to="/">NebulosaFilms</Link>
          </h1>
          <SearchBar
            onSearch={handleSearch}
            value={searchValue}
            setValue={setSearchValue}
            inputRef={searchInputRef}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>
      {/* Mensaje de bienvenida con transición */}
      <div
        className={`transition-all duration-500 ease-in-out ${showWelcome && !loading && movies.length === 0
          ? 'opacity-100 max-h-96 mb-8 mt-6'
          : 'opacity-0 max-h-0 mb-0 mt-0 pointer-events-none'
          }`}
      >
        <div className="text-center text-white max-w-xl mx-2 bg-gray-700 bg-opacity-70 rounded p-6">
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 w-full max-w-7xl mx-auto">
        {movies
          .filter(movie => movie.poster_path)
          .map(movie => (
            <Link key={movie.id} to={`/movie/${movie.id}`}>
              <MovieCard movie={movie} />
            </Link>
          ))}
      </div>
    </div>
  );
}