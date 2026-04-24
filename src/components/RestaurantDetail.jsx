export default function RestaurantDetail({ restaurant, onClose }) {
  if (!restaurant) return null;

  const vibes = restaurant.aggregated_vibes
    ? Object.entries(restaurant.aggregated_vibes)
    : [];

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="detail-name">{restaurant.restaurant_name}</h2>

        <div className="detail-meta">
          <span>{restaurant.latitude?.toFixed(5)}, {restaurant.longitude?.toFixed(5)}</span>
          <span>{restaurant.review_count} reviews</span>
        </div>

        {vibes.length > 0 && (
          <div className="detail-vibes">
            <h3>Vibes</h3>
            {vibes.map(([key, vibe]) => {
              const pct = Math.min(100, Math.round((vibe.score ?? 0) * 100));
              return (
                <div key={key} className="vibe-row">
                  <div className="vibe-label">
                    <span className="vibe-key">{key.replace(/_/g, ' ')}</span>
                    <span className="vibe-value">{vibe.dominant_value}</span>
                  </div>
                  <div className="vibe-bar-bg">
                    <div className="vibe-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="vibe-support">
                    score: {vibe.score?.toFixed(2)} &nbsp;·&nbsp; {vibe.support_reviews} supporting reviews
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
