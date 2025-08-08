import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import {
  DowntimeNotification,
  externalServices,
  externalServiceStatus,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { getScheduledDowntime } from 'platform/monitoring/DowntimeNotification/actions';
import {
  useDatadogRum,
  setDatadogRumUser,
  MhvSecondaryNav,
  useBackToTop,
  renderMHVDowntime,
} from '@department-of-veterans-affairs/mhv/exports';
import { useLocation } from 'react-router-dom-v5-compat';
import MhvServiceRequiredGuard from 'platform/mhv/components/MhvServiceRequiredGuard';
import { downtimeNotificationParams } from '../util/constants';
import { selectBypassDowntime } from '../util/selectors';

const App = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { measuredRef, isHidden } = useBackToTop(location);
  const contentClasses =
    'main-content usa-width-two-thirds medium-screen:vads-u-margin-left--neg2 vads-u-max-width--100';

  const user = useSelector(selectUser);
  const isBypassDowntime = useSelector(selectBypassDowntime);

  const { featureTogglesLoading } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
      };
    },
    state => state.featureToggles,
  );

  const globalDowntime = useSelector(
    state => state.scheduledDowntime?.globalDowntime,
  );

  const scheduledDownTimeIsReady = useSelector(
    state => state.scheduledDowntime?.isReady,
  );

  const scheduledDowntimes = useSelector(
    state => state.scheduledDowntime?.serviceMap || [],
  );

  useEffect(
    () => {
      if (!scheduledDownTimeIsReady) {
        dispatch(getScheduledDowntime());
      }
    },
    [dispatch, scheduledDownTimeIsReady],
  );

  const mhvRxDown = useMemo(
    () => {
      if (Object.keys(scheduledDowntimes).length > 0) {
        return (
          scheduledDowntimes &&
          ((scheduledDowntimes[externalServices.mhvMeds] &&
            scheduledDowntimes[externalServices.mhvMeds].status) ||
            (scheduledDowntimes[externalServices.mhvPlatform] &&
              scheduledDowntimes[externalServices.mhvPlatform].status) ||
            (scheduledDowntimes[externalServices.global] &&
              scheduledDowntimes[externalServices.global].status))
        );
      }
      return 'downtime status: ok';
    },
    [scheduledDowntimes, globalDowntime],
  );

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
    defaultPrivacyLevel: 'mask',
  };

  useDatadogRum(datadogRumConfig);
  useEffect(
    () => {
      setDatadogRumUser({ id: user?.profile?.accountUuid });
    },
    [user],
  );

  if (featureTogglesLoading) {
    return (
      <div className="main-content vads-u-max-width--100">
        <MhvSecondaryNav />
        <div className="vads-u-margin-y--6">
          <va-loading-indicator
            message="Loading..."
            setFocus
            data-testid="rx-feature-flag-loading-indicator"
          />
        </div>
      </div>
    );
  }

  return (
    <RequiredLoginView user={user} serviceRequired={[backendServices.RX]}>
      <MhvServiceRequiredGuard
        user={user}
        serviceRequired={[backendServices.RX]}
      >
        <MhvSecondaryNav />
        <div ref={measuredRef} className="routes-container usa-grid">
          <div className={`${contentClasses}`}>
            {mhvRxDown === externalServiceStatus.down && !isBypassDowntime ? (
              <>
                <h1 className="vads-u-margin-top--3">Medications</h1>
                <DowntimeNotification
                  appTitle={downtimeNotificationParams.appTitle}
                  dependencies={[
                    externalServices.mhvPlatform,
                    externalServices.mhvMeds,
                    externalServices.global,
                  ]}
                  render={renderMHVDowntime}
                />
              </>
            ) : (
              children
            )}
            <va-back-to-top
              class="no-print"
              hidden={isHidden}
              data-dd-privacy="mask"
              data-dd-action-name="Back to top"
              data-testid="rx-back-to-top"
            />
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
