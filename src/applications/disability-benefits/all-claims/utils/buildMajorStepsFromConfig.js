import formConfig from '../config/form';

// Configuration: which chapters to include and their labels (override chapter title if needed)
const CHAPTER_STEP_MAP = [
  { key: 'veteranDetails', label: 'Veteran Details' },
  { key: 'disabilities', label: 'Conditions' },
  { key: 'mentalHealth', label: 'Mental Health' },
  { key: 'supportingEvidence', label: 'Supporting Evidence' },
  { key: 'additionalInformation', label: 'Additional Information' },
];

// Fallback final step
const REVIEW_STEP = {
  key: 'reviewSubmit',
  label: 'Review and Submit',
  // Usually the platform review page
  primaryPath: '/review-and-submit',
  pathPrefixes: ['/review-and-submit', '/review', '/submit'],
  terminal: true,
};

let _cached; // simple memo

export function buildMajorSteps(formData) {
  if (_cached) return _cached;

  const { chapters } = formConfig;
  const steps = [];

  CHAPTER_STEP_MAP.forEach(({ key, label }, idx) => {
    const chapter = chapters[key];
    if (!chapter) return;

    const pages = Object.values(chapter.pages || {});
    // Collect all distinct paths (prefix them with slash for consistency)
    const pathPrefixes = pages
      .map(p => p.path)
      .filter(Boolean)
      .map(p => (p.startsWith('/') ? p : `/${p}`));

    if (pathPrefixes.length === 0) return;

    // Heuristic for primary path:
    // 1. First page with non-empty title (string) AND path AND valid depends (if any)
    // 2. Else first page with path
    const primaryCandidate =
      pages.find(p => {
        // avoid hidden pages based on current formData
        if (typeof p.depends === 'function' && !p.depends(formData)) {
          return false;
        }
        return (
          typeof p.title === 'string' &&
          p.title.trim() !== '' &&
          p.path &&
          !p.path.includes('page-break')
        );
      }) || pages.find(p => p.path);

    const primaryPath = primaryCandidate
      ? `/${primaryCandidate.path}`.replace(/\/{2,}/g, '/')
      : pathPrefixes[0];

    steps.push({
      idx,
      key,
      label,
      primaryPath,
      pathPrefixes,
    });
  });

  steps.push(REVIEW_STEP);
  _cached = steps;
  return steps;
}

export function findActiveMajorStep(pathname) {
  const clean = pathname.replace(/\/+$/, '').toLowerCase();
  return buildMajorSteps().find(step =>
    step.pathPrefixes.some(prefix => clean.startsWith(prefix.toLowerCase())),
  );
}
