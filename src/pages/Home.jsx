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

  return (
    <div
      className="min-h-screen flex flex-col justify-center p-8"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #102331 50%, #000 100%)',
      }}
    >
      <div className="w-full max-w-5xl mx-auto px-2 overflow-x-hidden">
        <h1 className="text-4xl font-bold text-[#00FFFF] mb-8 text-center cursor-pointer">
          <Link to="/">NebulosaFilms</Link>
        </h1>
        <SearchBar
          onSearch={handleSearch}
          value={searchValue}
          setValue={setSearchValue}
        />
        {loading && <p className="text-center text-gray-600">Cargando...</p>}
        {!loading && movies.length === 0 && hasSearched && (
          <p className="text-center text-gray-500">No se encontraron resultados.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 lg:gap-x-14 gap-y-8">
          {movies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`}>
              <MovieCard movie={movie} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}