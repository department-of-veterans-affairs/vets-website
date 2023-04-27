import { useEffect, useState } from 'react';

export const useShadowDomReady = () => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
      // time is random - no number is guaranteed to work
      // }, 125);
    }, 500);
  }, []);

  return isReady;
};
