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
  const [currentPage, setCurrentPage] = useState(1);
  const MOVIES_PER_PAGE = 8;

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

  // Reinicia la página al cambiar las películas
  useEffect(() => {
    setCurrentPage(1);
  }, [movies]);

  // Detecta si el header debe ser fijo en móvil cuando el input está enfocado y no se muestra el mensaje de bienvenida
  const showFixedHeader =
    searchFocused &&
    !showWelcome &&
    typeof window !== "undefined" &&
    window.innerWidth < 640;

  // Filtrado y paginación
  const filteredMovies = movies.filter(movie => movie.poster_path);
  const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * MOVIES_PER_PAGE,
    currentPage * MOVIES_PER_PAGE
  );

  // Encuentra la película más popular
  const mostPopular = filteredMovies.length > 0
    ? filteredMovies.reduce((a, b) => (a.popularity > b.popularity ? a : b))
    : null;

  return (
    <div
      className={`min-h-screen flex flex-col justify-center p-4 pb-24 sm:pb-8 bg-gradient-to-b from-[#102331] to-black overflow-x-hidden`}
      style={{
        backgroundImage: 'radial-gradient(circle at center, #102331 50%, #000 100%)',
        paddingTop: showFixedHeader ? '6.5rem' : undefined, // Ajusta según la altura real del header
      }}
    >
      {/* Header: título y barra de búsqueda */}
      <div
        className={`
          w-full z-20
          ${showFixedHeader ? 'fixed top-0 left-0 right-0 bg-[#102331] bg-opacity-95 backdrop-blur-md' : 'static'}
          sm:static sm:bg-transparent sm:backdrop-blur-0
          transition-all duration-300
        `}
        style={{
          maxWidth: '100vw',
        }}
      >
        <div className="max-w-xl w-full mx-auto pt-6 pb-4">
          <h1 className="text-4xl font-bold text-[#00FFFF] mb-4 text-center cursor-pointer">
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
      {/* Mensaje de bienvenida alineado con la barra de búsqueda (sin animación) */}
      {showWelcome && !loading && movies.length === 0 && (
        <div className="max-w-xl w-full mx-auto mb-8 mt-12">
          <div className="text-center text-white bg-gray-700 bg-opacity-70 rounded p-6">
            <h2 className="text-2xl font-bold mb-2 text-[#00FFFF]">¡Bienvenido!</h2>
            <p>
              Explora y busca información sobre películas, descubre detalles, reparto y tráilers. Usa la barra de búsqueda para empezar.
            </p>
          </div>
        </div>
      )}
      {loading && <p className="text-center text-gray-600">Cargando...</p>}
      {!loading && filteredMovies.length === 0 && hasSearched && (
        <p className="text-center text-gray-500">No se encontraron resultados.</p>
      )}

      {/* Película más popular (solo si no hay búsqueda activa) */}
      {!searchValue && mostPopular && (
        <div className="max-w-2xl mx-auto mb-8">
          <h2 className="text-xl font-bold text-[#00FFFF] mb-2 text-center">Película más popular</h2>
          <Link to={`/movie/${mostPopular.id}`}>
            <div className="flex flex-col sm:flex-row items-center bg-[#183d5a] bg-opacity-80 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform">
              <img
                src={`https://image.tmdb.org/t/p/w300${mostPopular.poster_path}`}
                alt={mostPopular.title}
                className="w-40 h-60 object-cover"
              />
              <div className="p-4 flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-[#00FFFF] mb-2">{mostPopular.title}</h3>
                <p className="text-gray-200 text-sm mb-2">{mostPopular.release_date ? mostPopular.release_date.substring(0, 4) : 'N/A'}</p>
                <p className="text-gray-300 text-base line-clamp-3">{mostPopular.overview}</p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Paginación */}
      {filteredMovies.length > 0 && (
        <div className="flex justify-center gap-2 my-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-cyan-400 text-[#102331] font-bold disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-2 text-white">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-cyan-400 text-[#102331] font-bold disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Películas paginadas */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 w-full max-w-7xl mx-auto">
        {paginatedMovies.map(movie => (
          <Link key={movie.id} to={`/movie/${movie.id}`}>
            <MovieCard movie={movie} />
          </Link>
        ))}
      </div>
    </div>
  );
}