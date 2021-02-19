import { useEffect } from 'react';

export default function useManualScrollRestoration() {
  useEffect(() => {
    if (window.History) {
      window.History.scrollRestoration = 'manual';
    }
  }, []);
}
