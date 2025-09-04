import environment from 'platform/utilities/environment';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';

// Add Datadog monitoring to the application
const useMonitoring = () => {
  useBrowserMonitoring({
    loggedIn: undefined, // optional, pass a boolean if log in required
    toggleName: 'discoverYourBenefitsBrowserMonitoringEnabled',
    applicationId: '4fd7481e-66ef-4a89-86d0-84e691ffdfa5',
    clientToken: 'pub02875174418494ddae85287f690d16d6',
    service: 'discover-your-benefits',
    version: '1.0.0',
    // example: record 100% of staging sessions, but only 10% of production
    sessionReplaySampleRate:
      environment.vspEnvironment() === 'staging' ? 100 : 10,
    // Add any additional RUM or LOG settings here
  });
};

export { useMonitoring };
