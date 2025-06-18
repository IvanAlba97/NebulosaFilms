export default function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div className="w-full h-[420px] flex flex-col border-2 border-[#00FFFF] rounded overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105 max-w-xs mx-auto">
      <img
        src={posterUrl}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="flex-1 p-4 bg-gradient-to-t from-[#00FFFF] to-white flex flex-col">
        <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
        <div className="mt-auto">
          <p className="text-gray-700 text-sm">
            {movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}