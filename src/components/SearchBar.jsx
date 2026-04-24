import { useState } from 'react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Find restaurants by vibe… e.g. 'cozy study spot'"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={isLoading}
        autoComplete="off"
      />
      <button
        type="submit"
        className="search-btn"
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
