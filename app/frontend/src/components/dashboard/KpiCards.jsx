import React from 'react';
import { Target, Car, Building2, Home } from 'lucide-react';
import { getScoreColorClass } from '../../utils/helpers';

export default function KpiCards({ data, thresholds = { good: 80, average: 50 } }) {
  // Calculs agrégés avec les données mockées
  const avgScore = data.length > 0 
    ? Math.round(data.reduce((acc, curr) => acc + curr.potentialScore, 0) / data.length)
    : 0;
    
  const avgMot = data.length > 0
    ? Math.round(data.reduce((acc, curr) => acc + curr.motorizationRate, 0) / data.length)
    : 0;

  const totalCopros = data.reduce((acc, curr) => acc + curr.coOwnershipCount, 0);
  
  const avgColl = data.length > 0
    ? Math.round(data.reduce((acc, curr) => acc + curr.collectiveHousingRatio, 0) / data.length)
    : 0;

  const scoreClass = getScoreColorClass(avgScore, thresholds);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard 
        title="Score de Potentiel Moyen" 
        value={avgScore} 
        icon={<Target size={24} />} 
        trend="+2%"
        styleClass={scoreClass}
      />
      <KpiCard 
        title="Taux de Motorisation (Moy)" 
        value={`${avgMot}%`} 
        icon={<Car size={24} />} 
        styleClass="text-blue-600 bg-blue-50"
      />
      <KpiCard 
        title="Copropriétés Ciblées" 
        value={totalCopros} 
        icon={<Building2 size={24} />} 
        styleClass="text-purple-600 bg-purple-50"
      />
      <KpiCard 
        title="Part de Logements Collectifs" 
        value={`${avgColl}%`} 
        icon={<Home size={24} />} 
        styleClass="text-indigo-600 bg-indigo-50"
      />
    </div>
  );
}

function KpiCard({ title, value, icon, trend, styleClass }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute opacity-5 -right-6 -top-6 transform group-hover:scale-110 transition-transform duration-500">
        {React.cloneElement(icon, { size: 120 })}
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${styleClass}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-semibold text-score-good bg-score-good/10 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
