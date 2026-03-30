import React from 'react';
import { getScoreBadgeClass } from '../../utils/helpers';
import { Trophy } from 'lucide-react';

export default function TopZonesTable({ data }) {
  // Trier par le score le plus haut
  const sortedData = [...data].sort((a, b) => b.potentialScore - a.potentialScore);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800">
          <Trophy size={20} className="text-yellow-500" />
          <h2 className="text-lg font-semibold tracking-tight">Classement des Zones Prioritaires</h2>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th className="py-4 px-6 font-medium">Ville</th>
              <th className="py-4 px-6 font-medium">Code Postal</th>
              <th className="py-4 px-6 font-medium text-center">Score Potentiel</th>
              <th className="py-4 px-6 font-medium text-right">Copropriétés</th>
              <th className="py-4 px-6 font-medium text-right">Taux Moto.</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">
                  Aucune donnée trouvée pour ces critères.
                </td>
              </tr>
            ) : (
              sortedData.map((zone, index) => (
                <tr 
                  key={zone.id} 
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono text-xs w-4">{index + 1}.</span>
                      {zone.city}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{zone.district}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getScoreBadgeClass(zone.potentialScore)}`}>
                      {zone.potentialScore}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-slate-600 font-medium">
                    {zone.coOwnershipCount}
                  </td>
                  <td className="py-4 px-6 text-right text-slate-600">
                    {zone.motorizationRate}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
