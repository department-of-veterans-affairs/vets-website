import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useBrowserMonitoring } from 'platform/monitoring/Datadog';
import {
  selectProfile,
  profileHasEHRM,
  profileHasVista,
  selectProfileLoa,
  selectProfileLogInProvider,
  selectVaPatient,
} from '../selectors';

// Configuration settings for Datadog
const DATADOG_CONFIG = {
  toggleName: 'termsOfUseBrowserMonitoringEnabled',
  applicationId: '1f81f762-c3fc-48c1-89d5-09d9236e340d',
  clientToken: 'pub3e48a5b97661792510e69581b3b272d1',
  service: 'terms-of-use-on-va.gov',
  version: '1.0.0',
  // Use higher sample rate in staging for testing, lower in production for cost control
  sessionReplaySampleRate:
    environment.vspEnvironment() === 'staging' ? 100 : 10,
  // Standard settings
  site: 'ddog-gov.com',
  sessionSampleRate: 100,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
};

const AppConfig = ({ children }) => {
  const profile = useSelector(selectProfile);

  // Initialize Datadog using platform utility
  useBrowserMonitoring({
    ...DATADOG_CONFIG,
    // Pass user attributes to be set when profile is loaded
    onRumInit: datadogRum => {
      const id = profile?.accountUuid;
      if (id && datadogRum) {
        datadogRum.setUser({
          id,
          hasEHRM: profileHasEHRM({ profile }),
          hasVista: profileHasVista({ profile }),
          CSP: selectProfileLogInProvider({ profile }),
          LOA: selectProfileLoa({ profile }),
          isVAPatient: selectVaPatient({ profile }),
        });
      }
    },
  });

  return <>{children}</>;
};

AppConfig.propTypes = {
  children: PropTypes.node,
};

export default AppConfig;
