import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`
      );
      const data = await res.json();
      setMovie(data);
      setLoading(false);
    };

    const fetchTrailer = async () => {
      const res = await fetch(
        `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=es-ES`
      );
      const data = await res.json();
      const trailer = data.results?.find(
        (vid) => vid.site === "YouTube" && vid.type === "Trailer"
      );
      if (trailer) setTrailerKey(trailer.key);
    };

    const fetchCast = async () => {
      const res = await fetch(
        `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=es-ES`
      );
      const data = await res.json();
      setCast(data.cast || []);
    };

    fetchMovie();
    fetchTrailer();
    fetchCast();
  }, [id]);

  const handleSearch = (query) => {
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!movie) return <p className="text-center mt-10">Movie not found.</p>;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div
      className="min-h-screen flex flex-col justify-center p-8"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #102331 50%, #000 100%)',
      }}
    >
      <div className="w-full max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-[#00FFFF] mb-8 text-center cursor-pointer">
          <Link to="/">NebulosaFilms</Link>
        </h1>
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="max-w-4xl mx-auto p-6 bg-gray-600 rounded mt-4 border-2 border-[#00FFFF] shadow-[0_4px_24px_0_rgba(255,255,255,0.7)]">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full md:w-64 max-w-xs max-h-[420px] object-cover rounded border-2 border-[#00FFFF] mx-auto"
          />
          <div className='flex-1 md:ml-2 md:mr-2'>
            <h2 className="text-3xl font-bold mb-2">
              <Link to="/" className="text-[#00FFFF] hover:underline">
                {movie.title}
              </Link>
            </h2>
            <p className="text-white mb-4">
              Fecha de lanzamiento: {movie.release_date || 'N/A'}
            </p>
            <p className="mb-4 text-white">{movie.overview || 'No description available.'}</p>
            <p className='mb-2 text-white'>
              <strong className='text-[#00FFFF]'>Género: </strong>
              {movie.genres?.map((g) => g.name).join(', ') || 'N/A'}
            </p>
            <p className='mb-2 text-white'>
              <strong className='text-[#00FFFF]'>Calificación: </strong> {movie.vote_average} / 10 ({movie.vote_count} votos)
            </p>
          </div>
        </div>

        {/* Reparto principal */}
        {cast.length > 0 && (
          <div className="w-full mb-8 mt-8">
            <strong className="text-[#00FFFF]">Reparto principal:</strong>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-2">
              {cast.slice(0, 5).map(actor => (
                <a
                  key={actor.id}
                  href={`https://es.wikipedia.org/wiki/${encodeURIComponent(actor.name.replace(/ /g, '_'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center bg-gray-700 rounded p-2 hover:bg-gray-800 transition"
                  title={`Ver a ${actor.name} en Wikipedia`}
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w92${actor.profile_path}`
                        : 'https://via.placeholder.com/48x72?text=No+Image'
                    }
                    alt={actor.name}
                    className="w-12 h-12 object-cover rounded-full border-2 border-[#00FFFF] mb-1"
                  />
                  <span className="text-white text-xs text-center">{actor.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Trailer debajo del reparto */}
        {trailerKey && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-[#00FFFF] mb-2">Tráiler</h3>
            <div className="w-full aspect-video rounded overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Tráiler de la película"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}