import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  setDatadogRumUser,
  useDatadogRum,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  selectProfile,
  profileHasEHRM,
  profileHasVista,
  selectProfileLoa,
  selectProfileLogInProvider,
  selectVaPatient,
} from '../selectors';

const AppConfig = ({
  children,
  setDatadogRumUserFn = setDatadogRumUser,
  useDatadogRumFn = useDatadogRum,
}) => {
  const profile = useSelector(selectProfile);

  useDatadogRumFn({
    applicationId: '1f81f762-c3fc-48c1-89d5-09d9236e340d',
    clientToken: 'pub3e48a5b97661792510e69581b3b272d1',
    site: 'ddog-gov.com',
    service: 'mhv-on-va.gov',
    sessionSampleRate: 50,
    sessionReplaySampleRate: 50,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });

  // Set uuid from profile, once there is a value
  useEffect(
    () => {
      const id = profile?.accountUuid;
      if (id) {
        const user = {
          id,
          hasEHRM: profileHasEHRM({ profile }),
          hasVista: profileHasVista({ profile }),
          CSP: selectProfileLogInProvider({ profile }),
          LOA: selectProfileLoa({ profile }),
          isVAPatient: selectVaPatient({ profile }),
        };
        setDatadogRumUserFn(user);
      }
    },
    [profile, setDatadogRumUserFn],
  );

  return <>{children}</>;
};

AppConfig.propTypes = {
  children: PropTypes.node,
  setDatadogRumUserFn: PropTypes.func,
  useDatadogRumFn: PropTypes.func,
};

export default AppConfig;
