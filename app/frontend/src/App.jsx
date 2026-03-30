import React, { useState, useMemo } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import Filters from './components/dashboard/Filters';
import KpiCards from './components/dashboard/KpiCards';
import InteractiveMap from './components/dashboard/InteractiveMap';
import TopZonesTable from './components/dashboard/TopZonesTable';
import { mockZones } from './data/mockData';

export default function App() {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedScore, setSelectedScore] = useState('all');

  // Extraire la liste unique des villes
  const availableCities = useMemo(() => {
    const cities = new Set(mockZones.map(z => z.city));
    return Array.from(cities).sort();
  }, []);

  // Filtrer les données selon les sélections
  const filteredData = useMemo(() => {
    return mockZones.filter(zone => {
      // Filtre Ville
      if (selectedCity !== 'all' && zone.city !== selectedCity) return false;
      
      // Filtre Score
      if (selectedScore !== 'all') {
        if (selectedScore === 'good' && zone.potentialScore < 80) return false;
        if (selectedScore === 'average' && (zone.potentialScore < 50 || zone.potentialScore >= 80)) return false;
        if (selectedScore === 'bad' && zone.potentialScore >= 50) return false;
      }

      return true;
    });
  }, [selectedCity, selectedScore]);

  return (
    <DashboardLayout>
      {/* Header section for the content area */}
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bonjour, l'équipe commerciale 👋</h2>
        <p className="text-slate-500 mt-1">Analyser le potentiel de prospection B2B selon nos critères de rentabilité.</p>
      </div>

      {/* Filters Area */}
      <Filters 
        cities={availableCities}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedScore={selectedScore}
        onScoreChange={setSelectedScore}
      />

      {/* Top Cards KPIs */}
      <KpiCards data={filteredData} />

      {/* Main complex interactions grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Left Column - Map (Larger width) */}
        <div className="lg:col-span-3">
          <InteractiveMap data={filteredData} />
        </div>
        
        {/* Right Column - Table Rankings */}
        <div className="lg:col-span-2">
          <TopZonesTable data={filteredData} />
        </div>
      </div>
    </DashboardLayout>
  );
}
