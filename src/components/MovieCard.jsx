export default function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div className="w-full flex flex-col border-2 border-[#00FFFF] rounded overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105 max-w-xs mx-auto">
      <img
        src={posterUrl}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-2 bg-gradient-to-t from-[#00FFFF] to-white">
        <h3 className="font-bold text-base mb-1 truncate" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-gray-700 text-xs">
          {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
        </p>
      </div>
    </div>
  );
}