'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function RadarMap() {
  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Weather Radar</h1>

      <MapContainer center={[51.505, -0.09]} zoom={5} style={{ height: '500px', width: '100%' }}>
        {/* OpenStreetMap base layer */}
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Weather radar layer from OpenWeatherMap */}
        <TileLayer
          url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=2f5912a74c2e44a091f171413250804`}
          attribution="© OpenWeatherMap"
        />
      </MapContainer>
    </main>
  );
}
