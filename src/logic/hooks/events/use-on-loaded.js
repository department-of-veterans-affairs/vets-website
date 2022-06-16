import { useEffect, useState } from 'react';

/**
 * Listens for the load event of the provided target element - `window` by default - & returns its loaded status.
 * @param targetElement The target element of which to listen for its loaded status.
 * @return The loaded status of the provided target element.
 */
export const useOnLoaded = (targetElement = window) => {
  const [loaded, setLoaded] = useState(false);
  const loadedHandler = () => setLoaded(true);

  useEffect(
    () => {
      targetElement?.addEventListener('load', loadedHandler);
      return () => {
        targetElement?.removeEventListener('load', loadedHandler);
      };
    },
    [targetElement],
  );

  return loaded;
};
