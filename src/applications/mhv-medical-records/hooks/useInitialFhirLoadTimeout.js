import { useState, useEffect } from 'react';
import { INITIAL_FHIR_LOAD_DURATION } from '../util/constants';

const useInitialFhirLoadTimeout = (
  initialFhirLoad,
  timeoutDuration = INITIAL_FHIR_LOAD_DURATION,
) => {
  const [initialFhirLoadTimedOut, setInitialFhirLoadTimedOut] = useState(false);

  useEffect(
    () => {
      if (!initialFhirLoad) {
        setInitialFhirLoadTimedOut(false);
        return null;
      }

      // We have an initialFhirLoad
      const elapsed = new Date() - initialFhirLoad;
      const remainingTime = Math.max(timeoutDuration - elapsed, 0);

      if (remainingTime === 0) {
        // Timeout already passed
        setInitialFhirLoadTimedOut(true);
        return null;
      }

      // Otherwise, schedule a timeout to set state to true
      const timeout = setTimeout(() => {
        setInitialFhirLoadTimedOut(true);
      }, remainingTime);

      return () => clearTimeout(timeout);
    },
    [initialFhirLoad, timeoutDuration],
  );

  return initialFhirLoadTimedOut;
};

export default useInitialFhirLoadTimeout;
