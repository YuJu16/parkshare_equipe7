import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Map as MapIcon } from 'lucide-react';

export default function InteractiveMap({ data, thresholds = { good: 80, average: 50 } }) {
  // Custom Icon factory based on score
  const createCustomIcon = (score) => {
    let bgColor;
    if (score >= thresholds.good) bgColor = 'bg-score-good';
    else if (score >= thresholds.average) bgColor = 'bg-score-average';
    else bgColor = 'bg-score-bad';

    const htmlString = `
      <div class="relative flex items-center justify-center w-8 h-8 group hover:scale-110 transition-transform duration-300">
        <div class="absolute inset-0 rounded-full opacity-20 ${bgColor} animate-pulse"></div>
        <div class="w-4 h-4 rounded-full border-2 border-white shadow-md ${bgColor}"></div>
        ${score >= thresholds.good ? `<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full ${bgColor} opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 ${bgColor}"></span></span>` : ''}
      </div>
    `;

    return L.divIcon({
      html: htmlString,
      className: 'custom-leaflet-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full min-h-[500px]">
      <div className="flex items-center gap-2 text-slate-800 mb-6 shrink-0">
        <MapIcon size={20} className="text-blue-600" />
        <h2 className="text-lg font-semibold tracking-tight">Carte de Chaleur Réelle</h2>
      </div>

      <div className="flex-1 rounded-lg overflow-hidden border border-slate-300 relative z-0">
        <MapContainer 
          center={[46.603354, 1.888334]} // Centre de la France
          zoom={5} 
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          {/* Fond clair (CartoDB Light All) pour un style SaaS */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {data.map((zone) => (
            <Marker 
              key={zone.id} 
              position={[zone.lat, zone.lng]}
              icon={createCustomIcon(zone.potentialScore)}
            >
              <Popup className="rounded-xl">
                <div className="p-1 font-sans">
                  <h3 className="font-bold text-slate-800">{zone.city} - {zone.district}</h3>
                  <div className="mt-2 text-sm text-slate-600 space-y-1">
                    <p>Score: <span className="font-bold text-slate-900">{zone.potentialScore}</span></p>
                    <p>Copropriétés: {zone.coOwnershipCount}</p>
                    <p>Taux de mot.: {zone.motorizationRate}%</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
