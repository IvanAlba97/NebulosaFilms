export default function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div className="w-full flex flex-col border-2 border-[#00FFFF] rounded overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105 max-w-xs mx-auto bg-gradient-to-t from-[#0f223a] via-[#183d5a] to-[#00ffff22]">
      <img
        src={posterUrl}
        alt={movie.title}
        className="w-full max-w-full h-64 object-cover"
      />
      <div className="p-2 bg-gradient-to-t from-[#102331] via-[#183d5a] to-[#00ffff11]">
        <h3 className="font-bold text-base mb-1 truncate text-[#00FFFF]" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-gray-200 text-xs">
          {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
        </p>
      </div>
    </div>
  );
}