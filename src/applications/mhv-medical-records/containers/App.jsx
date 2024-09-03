import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import PropTypes from 'prop-types';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import {
  renderMHVDowntime,
  useDatadogRum,
  MhvSecondaryNav,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  DowntimeNotification,
  externalServices,
  externalServiceStatus,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { getScheduledDowntime } from 'platform/monitoring/DowntimeNotification/actions';
import MrBreadcrumbs from '../components/MrBreadcrumbs';
import ScrollToTop from '../components/shared/ScrollToTop';
import PhrRefresh from '../components/shared/PhrRefresh';

import { flagsLoadedAndMhvEnabled } from '../util/selectors';
import { downtimeNotificationParams } from '../util/constants';

const App = ({ children }) => {
  const user = useSelector(selectUser);
  const userServices = user.profile.services;
  const hasMhvAccount = user.profile.mhvAccountState !== 'NONE';

  const { featureTogglesLoading, appEnabled } = useSelector(
    flagsLoadedAndMhvEnabled,
    state => state.featureToggles,
  );

  const dispatch = useDispatch();

  const [isHidden, setIsHidden] = useState(true);
  const [height, setHeight] = useState(0);
  const location = useLocation();
  const measuredRef = useRef();
  const atLandingPage = location.pathname === '/';

  const scheduledDowntimes = useSelector(
    state => state.scheduledDowntime?.serviceMap || [],
  );
  const globalDowntime = useSelector(
    state => state.scheduledDowntime?.globalDowntime,
  );

  const mhvMockSessionFlag = useSelector(
    state => state.featureToggles['mhv-mock-session'],
  );

  useEffect(
    () => {
      if (mhvMockSessionFlag) localStorage.setItem('hasSession', true);
    },
    [mhvMockSessionFlag],
  );

  const mhvMrDown = useMemo(
    () => {
      if (scheduledDowntimes.size > 0) {
        return (
          scheduledDowntimes?.get(externalServices.mhvMr)?.status ||
          scheduledDowntimes?.get(externalServices.mhvPlatform)?.status ||
          scheduledDowntimes?.get(externalServices.global)?.status ||
          globalDowntime
        );
      }
      return 'downtime status: ok';
    },
    [scheduledDowntimes, globalDowntime],
  );

  useEffect(
    () => {
      dispatch(getScheduledDowntime());
    },
    [dispatch],
  );

  const datadogRumConfig = {
    applicationId: '04496177-4c70-4caf-9d1e-de7087d1d296',
    clientToken: 'pubf11b8d8bfe126a01d84e01c177a90ad3',
    site: 'ddog-gov.com',
    service: 'va.gov-mhv-medical-records',
    sessionSampleRate: 100, // controls the percentage of overall sessions being tracked
    sessionReplaySampleRate: 50, // is applied after the overall sample rate, and controls the percentage of sessions tracked as Browser RUM & Session Replay
    trackInteractions: true,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask',
  };
  useDatadogRum(datadogRumConfig);

  useEffect(
    () => {
      if (height) {
        // small screen (mobile)
        if (window.innerWidth <= 481 && height > window.innerHeight * 4) {
          setIsHidden(false);
        }
        // medium screen (desktop/tablet)
        else if (window.innerWidth > 481 && height > window.innerHeight * 2) {
          setIsHidden(false);
        }
        // default to hidden
        else {
          setIsHidden(true);
        }
      }
    },
    [height, location],
  );

  const { current } = measuredRef;

  useEffect(
    () => {
      if (!current) return;
      const resizeObserver = new ResizeObserver(() => {
        setHeight(current.offsetHeight);
      });
      resizeObserver.observe(current);
    },
    [current],
  );

  useEffect(
    () => {
      // If the user is not whitelisted or feature flag is disabled, redirect them.
      if (featureTogglesLoading === false && appEnabled !== true) {
        window.location.replace('/health-care/get-medical-records');
      }
    },
    [featureTogglesLoading, appEnabled],
  );

  const isMissingRequiredService = (loggedIn, services) => {
    if (
      loggedIn &&
      hasMhvAccount &&
      !services.includes(backendServices.MEDICAL_RECORDS)
    ) {
      window.location.replace('/health-care/get-medical-records');
      return true;
    }
    return false;
  };

  if (featureTogglesLoading || user.profile.loading) {
    return (
      <>
        <MhvSecondaryNav />
        <div className="vads-l-grid-container">
          <va-loading-indicator
            message="Loading your medical records..."
            setFocus
            data-testid="mr-feature-flag-loading-indicator"
          />
        </div>
      </>
    );
  }

  if (appEnabled !== true) {
    // If the user is not whitelisted or feature flag is disabled, return nothing.
    return <></>;
  }

  return (
    <RequiredLoginView
      user={user}
      serviceRequired={[backendServices.MEDICAL_RECORDS]}
    >
      {isMissingRequiredService(user.login.currentlyLoggedIn, userServices) || (
        <>
          <MhvSecondaryNav />
          <div
            ref={measuredRef}
            className="vads-l-grid-container vads-u-padding-left--2"
          >
            {mhvMrDown === externalServiceStatus.down ? (
              <>
                {atLandingPage && <MrBreadcrumbs />}
                <h1 className={atLandingPage ? null : 'vads-u-margin-top--5'}>
                  Medical records
                </h1>
                <DowntimeNotification
                  appTitle={downtimeNotificationParams.appTitle}
                  dependencies={[
                    externalServices.mhvMr,
                    externalServices.mhvPlatform,
                    externalServices.global,
                  ]}
                  render={renderMHVDowntime}
                />
              </>
            ) : (
              <>
                <MrBreadcrumbs />
                <div className="vads-l-row">
                  <div className="medium-screen:vads-l-col--8">{children}</div>
                </div>
              </>
            )}
            <va-back-to-top hidden={isHidden} />
            <ScrollToTop />
            <PhrRefresh />
          </div>
        </>
      )}
    </RequiredLoginView>
  );
};

App.propTypes = {
  children: PropTypes.object,
};

export default App;
