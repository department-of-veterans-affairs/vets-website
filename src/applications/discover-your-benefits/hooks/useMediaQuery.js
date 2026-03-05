import { useEffect, useState } from 'react';

const useMediaQuery = query => {
  const [matches, setMatches] = useState(
    () =>
      typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(
    () => {
      if (typeof window === 'undefined') return null;

      const mediaQuery = window.matchMedia(query);
      const handler = e => setMatches(e.matches);

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    },
    [query],
  );

  return matches;
};

export default useMediaQuery;
