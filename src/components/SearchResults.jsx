export default function SearchResults({ results, selectedId, onSelect }) {
  if (!results || results.length === 0) {
    return (
      <div className="results-panel">
        <div className="results-empty">No results found.</div>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <div className="results-header">{results.length} result{results.length !== 1 ? 's' : ''}</div>
      <ul className="results-list">
        {results.map((r) => {
          const topVibes = r.aggregated_vibes
            ? Object.entries(r.aggregated_vibes).slice(0, 3)
            : [];
          return (
            <li
              key={r.business_id}
              className={`result-item${selectedId === r.business_id ? ' result-item--active' : ''}`}
              onClick={() => onSelect(r)}
            >
              <div className="result-name">{r.restaurant_name}</div>
              <div className="result-meta">
                {r.review_count} reviews &nbsp;·&nbsp;
                {r.latitude?.toFixed(4)}, {r.longitude?.toFixed(4)}
              </div>
              {topVibes.length > 0 && (
                <div className="result-vibes">
                  {topVibes.map(([key, vibe]) => (
                    <span key={key} className="vibe-tag">
                      {key.replace(/_/g, ' ')}: {vibe.dominant_value}
                    </span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
