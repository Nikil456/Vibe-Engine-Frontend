import { useState, useEffect } from 'react';
import { getRestaurants, getRestaurantDetail, searchRestaurants } from './api';
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import RestaurantDetail from './components/RestaurantDetail';
import './App.css';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchResults, setSearchResults] = useState(null); // null = no search yet
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRestaurants()
      .then((data) => setRestaurants(Array.isArray(data.restaurants) ? data.restaurants : []))
      .catch((err) => setError(err.message));
  }, []);

  async function handleSearch(query) {
    setIsSearching(true);
    setError(null);
    try {
      const data = await searchRestaurants(query);
      setSearchResults(data.results ?? []);
      setSelectedRestaurant(null);
      setDetailData(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSelectRestaurant(restaurant) {
    setSelectedRestaurant(restaurant);
    setDetailData(null);
    try {
      const detail = await getRestaurantDetail(restaurant.business_id);
      setDetailData(detail);
    } catch {
      // fall back to basic data already available
      setDetailData(restaurant);
    }
  }

  function handleCloseDetail() {
    setDetailData(null);
    setSelectedRestaurant(null);
  }

  function handleClear() {
    setSearchResults(null);
    setSelectedRestaurant(null);
    setDetailData(null);
    setError(null);
  }

  // Show search result markers when a search is active; otherwise all restaurants
  const mapRestaurants = searchResults ?? restaurants;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">Vibe Engine</div>
        <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        {searchResults !== null && (
          <button className="clear-btn" onClick={handleClear}>
            Clear
          </button>
        )}
      </header>

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      <main className="app-main">
        <div className="map-area">
          <MapComponent
            restaurants={mapRestaurants}
            selectedRestaurant={selectedRestaurant}
            onSelectRestaurant={handleSelectRestaurant}
          />
        </div>

        {searchResults !== null && (
          <aside className="results-sidebar">
            <SearchResults
              results={searchResults}
              selectedId={selectedRestaurant?.business_id}
              onSelect={handleSelectRestaurant}
            />
          </aside>
        )}
      </main>

      {detailData && (
        <RestaurantDetail restaurant={detailData} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

export default App;
