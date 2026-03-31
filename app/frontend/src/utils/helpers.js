export const getScoreColorClass = (score, thresholds = { good: 80, average: 50 }) => {
  if (score >= thresholds.good) return 'text-score-good bg-score-good/10';
  if (score >= thresholds.average) return 'text-score-average bg-score-average/10';
  return 'text-score-bad bg-score-bad/10';
};
export const getScoreBadgeClass = (score, thresholds = { good: 80, average: 50 }) => {
  if (score >= thresholds.good) return 'bg-score-good text-white';
  if (score >= thresholds.average) return 'bg-score-average text-white';
  return 'bg-score-bad text-white';
};
