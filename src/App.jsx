import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useRestaurants } from './hooks/useRestaurants'
import { useRestaurantSearch } from './hooks/useRestaurantSearch'
import './App.css'

function extractCoordinates(row) {
  if (!row || typeof row !== 'object') {
    return null
  }

  const directLat = Number(row.latitude ?? row.lat)
  const directLng = Number(row.longitude ?? row.lng ?? row.lon)
  if (Number.isFinite(directLat) && Number.isFinite(directLng)) {
    return [directLat, directLng]
  }

  const coords = row.coordinates
  if (Array.isArray(coords) && coords.length >= 2) {
    const lat = Number(coords[0])
    const lng = Number(coords[1])
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return [lat, lng]
    }
  }

  if (coords && typeof coords === 'object') {
    const lat = Number(coords.latitude ?? coords.lat)
    const lng = Number(coords.longitude ?? coords.lng ?? coords.lon)
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return [lat, lng]
    }
  }

  return null
}

function normalizeRestaurants(rows) {
  return rows
    .map((row, index) => {
      const position = extractCoordinates(row)
      if (!position) {
        return null
      }

      return {
        id: row.business_id || row.id || `${row.name || 'restaurant'}-${index}`,
        name: row.name || row.business_name || 'Unnamed restaurant',
        city: row.city || row.location?.city || '',
        vibe: row.vibe_summary || row.summary || row.review_snippet || '',
        position,
      }
    })
    .filter(Boolean)
}

function App() {
  const [query, setQuery] = useState('')
  const { restaurants, loading, error, reload } = useRestaurants()
  const {
    results,
    searching,
    error: searchError,
    hasSearched,
    runSearch,
    clearSearch,
  } = useRestaurantSearch()

  const activeRows = hasSearched ? results : restaurants
  const markers = useMemo(() => normalizeRestaurants(activeRows), [activeRows])
  const markerCount = markers.length
  const center = markers.length > 0 ? markers[0].position : [40.713, -74.006]

  const handleSubmit = async (event) => {
    event.preventDefault()
    await runSearch(query)
  }

  const handleReset = () => {
    setQuery('')
    clearSearch()
  }

  return (
    <>
      <section className="toolbar">
        <h1>Vibe Engine</h1>
        <p>Discover restaurants by vibe and map context.</p>
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: cozy date night, loud brunch, casual ramen"
            aria-label="Search restaurant vibes"
          />
          <button type="submit" disabled={searching || loading}>
            {searching ? 'Searching...' : 'Search'}
          </button>
          <button type="button" className="secondary" onClick={handleReset}>
            Reset
          </button>
          <button type="button" className="secondary" onClick={reload} disabled={loading}>
            Refresh
          </button>
        </form>
      </section>

      <section className="status-strip" aria-live="polite">
        {loading ? 'Loading restaurants...' : `${markerCount} restaurant markers visible`}
        {hasSearched ? ' (filtered by search)' : ''}
      </section>

      {error ? <p className="error">Failed to load restaurants: {error}</p> : null}
      {searchError ? <p className="error">Search error: {searchError}</p> : null}

      <section id="center">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '460px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((row) => (
            <Marker key={row.id} position={row.position}>
              <Popup>
                <strong>{row.name}</strong>
                {row.city ? <div>{row.city}</div> : null}
                {row.vibe ? <p>{row.vibe}</p> : null}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>API wiring complete</h2>
          <p>The frontend now reads from FastAPI endpoints via fetch + Vite proxy.</p>
          <ul className="facts">
            <li>Initial markers: GET /v1/restaurants</li>
            <li>Search: POST /v1/search</li>
            <li>Dev proxy: /api -&gt; localhost:8000</li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
