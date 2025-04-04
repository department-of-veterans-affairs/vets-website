import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import {
  DowntimeNotification,
  externalServices,
  externalServiceStatus,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import {
  MHVDowntime,
  useDatadogRum,
  MhvSecondaryNav,
  useBackToTop,
} from '@department-of-veterans-affairs/mhv/exports';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import MhvServiceRequiredGuard from 'platform/mhv/components/MhvServiceRequiredGuard';
import { medicationsUrls } from '../util/constants';
import { selectRemoveLandingPageFlag } from '../util/selectors';

const App = ({ children }) => {
  const location = useLocation();
  const { measuredRef, isHidden } = useBackToTop(location);
  const user = useSelector(selectUser);
  const contentClasses =
    'main-content usa-width-two-thirds medium-screen:vads-u-margin-left--neg2 vads-u-max-width--100';
  const { featureTogglesLoading, appEnabled } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        appEnabled:
          state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsToVaGovRelease],
      };
    },
    state => state.featureToggles,
  );
  const removeLandingPage = useSelector(selectRemoveLandingPageFlag);

  const datadogRumConfig = {
    applicationId: '2b875bc2-034a-445b-868c-d43bec8928d1',
    clientToken: 'pubb9b9c833770797060110a821283a0892',
    site: 'ddog-gov.com',
    service: 'va.gov-mhv-medications',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 50,
    trackInteractions: true,
    trackFrustrations: true,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  };
  useDatadogRum(datadogRumConfig);

  if (featureTogglesLoading) {
    return (
      <div className="main-content vads-u-max-width--100">
        <MhvSecondaryNav />
        <va-loading-indicator
          message="Loading..."
          set-focus
          data-testid="rx-feature-flag-loading-indicator"
        />
      </div>
    );
  }

  const homeURL = removeLandingPage
    ? medicationsUrls.MEDICATIONS_URL
    : medicationsUrls.MEDICATIONS_ABOUT;

  if (!appEnabled && window.location.pathname !== homeURL) {
    window.location.replace(homeURL);
    return <></>;
  }

  return (
    <RequiredLoginView user={user}>
      <MhvServiceRequiredGuard
        user={user}
        serviceRequired={[backendServices.RX]}
      >
        <MhvSecondaryNav />
        <div ref={measuredRef} className="routes-container usa-grid">
          <div className={`${contentClasses}`}>
            <DowntimeNotification
              appTitle="Medications"
              dependencies={[
                externalServices.mhvPlatform,
                externalServices.mhvMeds,
              ]}
              render={(downtimeProps, downtimeChildren) => (
                <>
                  {downtimeProps.status === externalServiceStatus.down && (
                    <h1 className="vads-u-margin-top--4">Medications</h1>
                  )}
                  {downtimeProps.status ===
                    externalServiceStatus.downtimeApproaching && (
                    <div className="vads-u-margin-top--4" />
                  )}
                  <MHVDowntime {...downtimeProps}>
                    {downtimeChildren}
                  </MHVDowntime>
                </>
              )}
            >
              {children}
              <va-back-to-top
                class="no-print"
                hidden={isHidden}
                data-dd-privacy="mask"
                data-dd-action-name="Back to top"
                data-testid="rx-back-to-top"
              />
            </DowntimeNotification>
          </div>
        </div>
      </MhvServiceRequiredGuard>
    </RequiredLoginView>
  );
};

App.propTypes = {
  children: PropTypes.node,
};

export default App;
