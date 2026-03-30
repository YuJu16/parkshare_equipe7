import React from 'react';
import { Map as MapIcon, MapPin } from 'lucide-react';
import { getScoreColorClass } from '../../utils/helpers';

export default function InteractiveMap({ data }) {
  // Simple fonction déterministe pour positionner les markers
  const getCoordinates = (index, total) => {
    // Évite les bords, répartit selon l'index
    const cols = Math.ceil(Math.sqrt(total || 1));
    const rawX = (index % cols) / cols;
    const rawY = Math.floor(index / cols) / rows(total, cols);
    
    return {
      left: `${20 + (rawX * 60) + (index % 2 * 10)}%`,
      top: `${20 + (rawY * 60)}%`
    };
  };

  const rows = (total, cols) => Math.ceil(total / cols) || 1;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
      <div className="flex items-center gap-2 text-slate-800 mb-6">
        <MapIcon size={20} className="text-blue-600" />
        <h2 className="text-lg font-semibold tracking-tight">Carte de Chaleur Potentielle</h2>
      </div>

      <div className="flex-1 rounded-lg bg-[#E2E8F0] relative overflow-hidden flex items-center justify-center border border-slate-300">
        {/* Grille d'arrière-plan pour feindre une carte */}
        <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgtdjIwSDIweiIgZmlsbPSiI2U4ZWRmNCIgZmlsbC1vcGFjaXR5PSIuNSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-40"></div>
        {/* Eléments géométriques SVG pour imiter des quartiers */}
        <svg className="absolute inset-0 w-full h-full opacity-30 text-slate-400" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
           <path d="M 10 20 L 30 15 L 45 40 Z" fill="#cbd5e1" />
           <path d="M 50 10 L 80 5 L 90 30 L 60 40 Z" fill="#cbd5e1" />
           <path d="M 20 60 L 40 50 L 50 80 L 15 90 Z" fill="#cbd5e1" />
           <path d="M 60 50 L 95 60 L 85 95 L 55 90 Z" fill="#cbd5e1" />
        </svg>

        {data.length === 0 ? (
          <div className="z-10 text-slate-500 font-medium">Aucune zone ne correspond aux filtres.</div>
        ) : (
          data.map((zone, idx) => {
            const { left, top } = getCoordinates(idx, data.length);
            const isTop = zone.potentialScore >= 80;
            return (
              <div 
                key={zone.id}
                className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all hover:z-20 scale-100 hover:scale-125 duration-300"
                style={{ left, top }}
              >
                <div className={`relative ${isTop ? 'animate-bounce' : ''}`}>
                  <MapPin 
                    size={isTop ? 40 : 28} 
                    className={`drop-shadow-lg ${getScoreColorClass(zone.potentialScore).split(' ')[0]}`}
                    fill="currentColor"
                  />
                  {isTop && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-score-good opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-score-good"></span>
                    </span>
                  )}
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-xl whitespace-nowrap z-30 pointer-events-none">
                  {zone.city} - {zone.district} <br/>
                  Score: {zone.potentialScore}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
