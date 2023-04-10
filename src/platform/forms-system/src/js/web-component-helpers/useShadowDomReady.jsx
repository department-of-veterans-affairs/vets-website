import { useEffect, useState } from 'react';

// adding a 1 tick delay will force other async operations such as
// attaching shadow dom to complete before we return true
export const useShadowDomReady = () => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 1);
  }, []);

  return isReady;
};
