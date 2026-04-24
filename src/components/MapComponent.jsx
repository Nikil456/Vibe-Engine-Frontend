import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

function HeatLayer({ restaurants }) {
  const map = useMap();

  useEffect(() => {
    if (!restaurants || restaurants.length === 0) return;
    const points = restaurants
      .filter((r) => r.latitude && r.longitude)
      .map((r) => [r.latitude, r.longitude, 1]);
    const heat = L.heatLayer(points, { radius: 25, blur: 15, maxZoom: 17, max: 1 });
    heat.addTo(map);
    return () => {
      map.removeLayer(heat);
    };
  }, [map, restaurants]);

  return null;
}

function FlyToSelected({ restaurant }) {
  const map = useMap();
  useEffect(() => {
    if (restaurant?.latitude && restaurant?.longitude) {
      map.flyTo([restaurant.latitude, restaurant.longitude], 16, { duration: 1 });
    }
  }, [map, restaurant]);
  return null;
}

function FitBounds({ restaurants }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current || !restaurants || restaurants.length === 0) return;
    const valid = restaurants.filter((r) => r.latitude && r.longitude);
    if (valid.length === 0) return;
    const bounds = L.latLngBounds(valid.map((r) => [r.latitude, r.longitude]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    fitted.current = true;
  }, [map, restaurants]);

  return null;
}

const DEFAULT_CENTER = [40.713, -74.006];

export default function MapComponent({ restaurants, selectedRestaurant, onSelectRestaurant }) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatLayer restaurants={restaurants} />
      <FitBounds restaurants={restaurants} />
      <FlyToSelected restaurant={selectedRestaurant} />
      {restaurants?.map((r) =>
        r.latitude && r.longitude ? (
          <CircleMarker
            key={r.business_id}
            center={[r.latitude, r.longitude]}
            radius={selectedRestaurant?.business_id === r.business_id ? 10 : 6}
            pathOptions={{
              fillColor: selectedRestaurant?.business_id === r.business_id ? '#ef4444' : '#3b82f6',
              fillOpacity: 0.9,
              color: '#fff',
              weight: 1.5,
            }}
            eventHandlers={{ click: () => onSelectRestaurant(r) }}
          >
            <Popup>
              <strong>{r.restaurant_name}</strong>
              <br />
              {r.review_count} reviews
            </Popup>
          </CircleMarker>
        ) : null
      )}
    </MapContainer>
  );
}
