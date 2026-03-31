import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import Filters from './components/dashboard/Filters';
import KpiCards from './components/dashboard/KpiCards';
import InteractiveMap from './components/dashboard/InteractiveMap';
import TopZonesTable from './components/dashboard/TopZonesTable';
import ChatBox from './components/chat/ChatBox';

export default function App() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedScore, setSelectedScore] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch('/api/scores/top/100')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(item => ({
          id: item.code_commune,
          city: item.nom_commune,
          district: item.code_commune,
          potentialScore: Math.round(item.score_potentiel),
          motorizationRate: Math.round(item.pourcentage_motorisation),
          coOwnershipCount: item.nb_coproprietes,
          collectiveHousingRatio: 0,
          lat: item.lat,
          lng: item.long,
        }));
        setZones(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const availableCities = useMemo(() => {
    const cities = new Set(zones.map(z => z.city));
    return Array.from(cities).sort();
  }, [zones]);

  const filteredData = useMemo(() => {
    return zones.filter(zone => {
      if (selectedCity !== 'all' && zone.city !== selectedCity) return false;
      if (selectedScore !== 'all') {
        if (selectedScore === 'good' && zone.potentialScore < 80) return false;
        if (selectedScore === 'average' && (zone.potentialScore < 50 || zone.potentialScore >= 80)) return false;
        if (selectedScore === 'bad' && zone.potentialScore >= 50) return false;
      }
      return true;
    });
  }, [zones, selectedCity, selectedScore]);

  if (loading) return <div className="flex items-center justify-center h-screen text-slate-500">Chargement des données...</div>;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="mb-2">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bonjour, l'équipe commerciale 👋</h2>
              <p className="text-slate-500 mt-1">Analyser le potentiel de prospection B2B selon nos critères de rentabilité.</p>
            </div>
            <Filters cities={availableCities} selectedCity={selectedCity} onCityChange={setSelectedCity} selectedScore={selectedScore} onScoreChange={setSelectedScore} />
            <KpiCards data={filteredData} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
              <div className="lg:col-span-3"><InteractiveMap data={filteredData} /></div>
              <div className="lg:col-span-2"><TopZonesTable data={filteredData} /></div>
            </div>
          </>
        );
      case 'map':
        return (
          <div className="flex flex-col space-y-6">
            <Filters cities={availableCities} selectedCity={selectedCity} onCityChange={setSelectedCity} selectedScore={selectedScore} onScoreChange={setSelectedScore} />
            <div className="h-[750px] w-full"><InteractiveMap data={filteredData} /></div>
          </div>
        );
      case 'opportunities':
        return (
          <div className="flex flex-col space-y-6">
            <Filters cities={availableCities} selectedCity={selectedCity} onCityChange={setSelectedCity} selectedScore={selectedScore} onScoreChange={setSelectedScore} />
            <TopZonesTable data={filteredData} />
          </div>
        );
      case 'clients':
      case 'settings':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
            <h3 className="text-2xl font-bold mb-2">En construction 🚧</h3>
            <p>Cette page n'est pas encore disponible.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
      <ChatBox />
    </DashboardLayout>
  );
}