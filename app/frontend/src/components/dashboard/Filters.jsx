import React from 'react';
import { Filter } from 'lucide-react';

export default function Filters({ cities, selectedCity, onCityChange, selectedScore, onScoreChange }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Filter size={20} />
        <span className="font-medium">Filtres de recherche</span>
      </div>
      
      <div className="flex flex-1 sm:justify-end gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-48">
          <select 
            value={selectedCity} 
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer"
          >
            <option value="all">Toutes les villes</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        <div className="relative w-full sm:w-48">
          <select 
            value={selectedScore} 
            onChange={(e) => onScoreChange(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow cursor-pointer"
          >
            <option value="all">Tous les scores</option>
            <option value="good">Fort potentiel (&gt;80)</option>
            <option value="average">Moyen (50-80)</option>
            <option value="bad">Faible (&lt;50)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
