import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, value, setValue, inputRef }) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSearch(value);
      }}
      className="flex gap-2 mb-6"
    >
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        type="text"
        placeholder="Buscar película..."
        className="flex-1 px-4 py-2 rounded border-2 border-[#00FFFF] focus:outline-none focus:border-cyan-400"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-cyan-400 text-[#102331] rounded font-bold hover:bg-cyan-300 transition"
      >
        Buscar
      </button>
    </form>
  );
}