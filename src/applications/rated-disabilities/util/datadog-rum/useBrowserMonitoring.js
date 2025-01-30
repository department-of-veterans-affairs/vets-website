import { useEffect } from 'react';

// import initializeBrowserLogging from './initializeBrowserLogging';
import initializeRealUserMonitoring from './initializeRealUserMonitoring';

// Initialize Datadog RUM behind feature flag
export const useBrowserMonitoring = ({ loggedIn, ...settings }) => {
  useEffect(
    () => {
      if (!loggedIn) {
        return;
      }

      initializeRealUserMonitoring(settings);
      // TODO: Waiting to enable this until Real User Monitoring has been QA'd
      // initializeBrowserLogging(settings);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedIn],
  );
};
