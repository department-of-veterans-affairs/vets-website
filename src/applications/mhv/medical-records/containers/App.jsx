import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import PropTypes from 'prop-types';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import MrBreadcrumbs from '../components/MrBreadcrumbs';
import ScrollToTop from '../components/shared/ScrollToTop';
import Navigation from '../components/Navigation';
import { useDatadogRum } from '../../shared/hooks/useDatadogRum';

const App = ({ children }) => {
  const user = useSelector(selectUser);
  const { featureTogglesLoading, appEnabled, showSideNav } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        appEnabled:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvMedicalRecordsToVaGovRelease
          ],
        showSideNav:
          state.featureToggles[
            FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplaySidenav
          ],
      };
    },
    state => state.featureToggles,
  );

  const [isHidden, setIsHidden] = useState(true);
  const [height, setHeight] = useState(0);
  const location = useLocation();
  const measuredRef = useRef();

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
    defaultPrivacyLevel: 'mask-user-input',
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

  useEffect(() => {
    if (!measuredRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setHeight(measuredRef.current.offsetHeight);
    });
    resizeObserver.observe(measuredRef.current);
  }, []);

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
  // If the user is not whitelisted or feature flag is disabled, redirect them.
  if (!appEnabled) {
    window.location.replace('/health-care/get-medical-records');
    return <></>;
  }
  return (
    <RequiredLoginView user={user}>
      <div
        ref={measuredRef}
        className="vads-l-grid-container vads-u-padding-left--2"
      >
        <MrBreadcrumbs />
        <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
          {showSideNav && (
            <>
              <Navigation data-testid="mhv-mr-navigation" />
              <div className="vads-u-margin-right--4" />
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
        <va-back-to-top hidden={isHidden} />
        <ScrollToTop />
      </div>
    </RequiredLoginView>
  );
};

App.propTypes = {
  children: PropTypes.object,
};

export default App;
