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
import Navigation from '../components/Navigation';

import {
  flagsLoadedAndMhvEnabled,
  selectConditionsFlag,
  selectLabsAndTestsFlag,
  selectNotesFlag,
  selectSidenavFlag,
  selectVaccinesFlag,
  selectVitalsFlag,
  selectSettingsPageFlag,
} from '../util/selectors';
import { downtimeNotificationParams } from '../util/constants';

const App = ({ children }) => {
  const user = useSelector(selectUser);
  const userServices = user.profile.services;

  const { featureTogglesLoading, appEnabled } = useSelector(
    flagsLoadedAndMhvEnabled,
    state => state.featureToggles,
  );

  const dispatch = useDispatch();

  // Individual feature flags
  const showSideNav = useSelector(selectSidenavFlag);
  const showConditions = useSelector(selectConditionsFlag);
  const showLabsAndTests = useSelector(selectLabsAndTestsFlag);
  const showNotes = useSelector(selectNotesFlag);
  const showVaccines = useSelector(selectVaccinesFlag);
  const showVitals = useSelector(selectVitalsFlag);
  const showSettingsPage = useSelector(selectSettingsPageFlag);

  const [isHidden, setIsHidden] = useState(true);
  const [height, setHeight] = useState(0);
  const [paths, setPaths] = useState([]);
  const location = useLocation();
  const measuredRef = useRef();
  const atLandingPage = location.pathname === '/';

  const scheduledDowntimes = useSelector(
    state => state.scheduledDowntime?.serviceMap || [],
  );
  const globalDowntime = useSelector(
    state => state.scheduledDowntime?.globalDowntime,
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

  const addSideNavItem = (navPaths, isDisplayed, path, label) => {
    if (isDisplayed)
      navPaths[0].subpaths.push({
        path,
        label,
        datatestid: `${path.replace(/\//, '')}-sidebar`,
      });
  };

  useEffect(
    () => {
      const navPaths = [
        {
          path: '/',
          label: 'Medical records',
          datatestid: 'about-va-medical-records-sidebar',
          subpaths: [
            // {
            //   path: '/download-all',
            //   label: 'Download all medical records',
            //   datatestid: 'download-your-medical-records-sidebar',
            // }
          ],
        },
      ];
      addSideNavItem(
        navPaths,
        showLabsAndTests,
        '/labs-and-tests',
        'Lab and test results',
      );
      addSideNavItem(
        navPaths,
        showNotes,
        '/summaries-and-notes',
        'Care summaries and notes',
      );
      addSideNavItem(navPaths, showVaccines, '/vaccines', 'Vaccines');
      addSideNavItem(navPaths, true, '/allergies', 'Allergies and reactions');
      addSideNavItem(
        navPaths,
        showConditions,
        '/conditions',
        'Health conditions',
      );
      addSideNavItem(navPaths, showVitals, '/vitals', 'Vitals');
      addSideNavItem(
        navPaths,
        showSettingsPage,
        '/settings',
        'Medical records settings',
      );

      setPaths(navPaths);
    },
    [
      showConditions,
      showLabsAndTests,
      showNotes,
      showVaccines,
      showVitals,
      showSettingsPage,
    ],
  );

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
    if (loggedIn && !services.includes(backendServices.MEDICAL_RECORDS)) {
      window.location.replace('/health-care/get-medical-records');
      return true;
    }
    return false;
  };

  if (featureTogglesLoading) {
    return (
      <div className="vads-l-grid-container">
        <va-loading-indicator
          message="Loading your medical records..."
          setFocus
          data-testid="mr-feature-flag-loading-indicator"
        />
      </div>
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
              <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
                {showSideNav && (
                  <>
                    <Navigation paths={paths} data-testid="mhv-mr-navigation" />
                    <div className="vads-u-margin-right--4 no-print" />
                  </>
                )}
                <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-x--0 vads-u-flex--fill">
                  <div className="vads-l-row">
                    <div className="vads-l-col">{children}</div>
                    {!showSideNav && (
                      <div className="medium-screen:vads-l-col--4 no-print" />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          <va-back-to-top hidden={isHidden} />
          <ScrollToTop />
          <PhrRefresh />
        </div>
      )}
    </RequiredLoginView>
  );
};

App.propTypes = {
  children: PropTypes.object,
};

export default App;
