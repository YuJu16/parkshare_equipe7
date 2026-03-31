import React, { useState } from 'react';
import { getScoreBadgeClass } from '../../utils/helpers';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

export default function TopZonesTable({ data, thresholds = { good: 80, average: 50 } }) {
  const [page, setPage] = useState(0);

  const sortedData = [...data].sort((a, b) => b.potentialScore - a.potentialScore);
  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
  const pageData = sortedData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const prevPage = () => setPage(p => Math.max(0, p - 1));
  const nextPage = () => setPage(p => Math.min(totalPages - 1, p + 1));

  // Reset page when data changes (filtres)
  React.useEffect(() => { setPage(0); }, [data]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-slate-800">
          <Trophy size={18} className="text-yellow-500" />
          <h2 className="text-base font-semibold tracking-tight">Zones Prioritaires</h2>
        </div>
        <span className="text-xs text-slate-400">{sortedData.length} zones</span>
      </div>

      {/* Table scrollable */}
      <div className="overflow-x-auto flex-1 overflow-y-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 sticky top-0">
              <th className="py-3 px-4 font-medium">#</th>
              <th className="py-3 px-4 font-medium">Ville</th>
              <th className="py-3 px-4 font-medium text-center">Score</th>
              <th className="py-3 px-4 font-medium text-right">Copro.</th>
              <th className="py-3 px-4 font-medium text-right">Moto.</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pageData.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500 text-sm">
                  Aucune donnée trouvée.
                </td>
              </tr>
            ) : (
              pageData.map((zone, index) => (
                <tr
                  key={page * PAGE_SIZE + index}
                  className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3 px-4 text-slate-400 font-mono text-xs">
                    {page * PAGE_SIZE + index + 1}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 text-xs max-w-[100px] truncate">
                    {zone.city}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getScoreBadgeClass(zone.potentialScore, thresholds)}`}>
                      {zone.potentialScore}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 text-xs font-medium">
                    {zone.coOwnershipCount}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500 text-xs">
                    {zone.motorizationRate}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
          <button
            onClick={prevPage}
            disabled={page === 0}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
          >
            <ChevronLeft size={14} /> Préc.
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const pageIndex = totalPages <= 7 ? i : (
                page < 4 ? i : (page > totalPages - 4 ? totalPages - 7 + i : page - 3 + i)
              );
              return (
                <button
                  key={pageIndex}
                  onClick={() => setPage(pageIndex)}
                  className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                    pageIndex === page
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {pageIndex + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={nextPage}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
          >
            Suiv. <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
