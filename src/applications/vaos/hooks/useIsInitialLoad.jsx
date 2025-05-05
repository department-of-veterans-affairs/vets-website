import { useRef, useEffect } from 'react';
/**
 * This hook returns true until isLoading is false, then it always
 * returns false, regardless of any further changes to the value of isLoading
 *
 * You can use this if you want to have different behavior the first time something
 * loads, vs any subsequent requests for the same api call.
 *
 * @export
 * @param {boolean} isLoading Current loading state.
 * @returns {boolean} Returns if we're still in the initial loading state
 */
export default function useIsInitialLoad(isLoading) {
  const initialLoadRef = useRef(true);
  useEffect(() => {
    if (!isLoading) {
      initialLoadRef.current = false;
    }
  }, [isLoading]);

  return initialLoadRef.current;
}
