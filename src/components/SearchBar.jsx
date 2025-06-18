import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, value = '', setValue }) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (setValue) setValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-12 flex max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Buscar películas..."
        value={query}
        onChange={handleChange}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#00FFFF]"
      />
      {/* Puedes añadir el botón de búsqueda aquí si lo necesitas */}
    </form>
  );
}