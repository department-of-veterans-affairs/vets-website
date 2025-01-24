import { useState, useEffect } from 'react';
import { INITIAL_FHIR_LOAD_DURATION } from '../util/constants';

const useInitialFhirLoadTimeout = (
  initialFhirLoad,
  timeoutDuration = INITIAL_FHIR_LOAD_DURATION,
) => {
  const [initialFhirLoadTimedOut, setInitialFhirLoadTimedOut] = useState(false);

  useEffect(
    () => {
      if (initialFhirLoad) {
        const elapsed = new Date() - initialFhirLoad; // Difference in milliseconds
        const remainingTime = Math.max(timeoutDuration - elapsed, 0); // Remaining time in milliseconds

        if (remainingTime === 0) {
          setInitialFhirLoadTimedOut(true); // If timeout has already passed
        } else {
          const timeout = setTimeout(() => {
            setInitialFhirLoadTimedOut(true);
          }, remainingTime);

          return () => clearTimeout(timeout); // Cleanup the timeout
        }
      }
      setInitialFhirLoadTimedOut(false);
      return null;
    },
    [initialFhirLoad, timeoutDuration],
  );

  return initialFhirLoadTimedOut;
};

export default useInitialFhirLoadTimeout;
