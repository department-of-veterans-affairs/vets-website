import { useMemo } from 'react';

export const useReviewPage = () => {
  return useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('review') === 'true';
  }, []);
};
