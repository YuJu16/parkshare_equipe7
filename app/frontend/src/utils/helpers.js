export const getScoreColorClass = (score) => {
  if (score >= 80) return 'text-score-good bg-score-good/10';
  if (score >= 50) return 'text-score-average bg-score-average/10';
  return 'text-score-bad bg-score-bad/10';
};
export const getScoreBadgeClass = (score) => {
  if (score >= 80) return 'bg-score-good text-white';
  if (score >= 50) return 'bg-score-average text-white';
  return 'bg-score-bad text-white';
};
