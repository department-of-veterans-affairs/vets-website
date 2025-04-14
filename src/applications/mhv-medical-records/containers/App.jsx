import React, { useEffect, useMemo } from 'react';
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
  useBackToTop,
} from '@department-of-veterans-affairs/mhv/exports';
import {
  DowntimeNotification,
  externalServices,
  externalServiceStatus,
} from '@department-of-veterans-affairs/platform-monitoring/DowntimeNotification';
import { getScheduledDowntime } from 'platform/monitoring/DowntimeNotification/actions';
import MhvServiceRequiredGuard from 'platform/mhv/components/MhvServiceRequiredGuard';
import MrBreadcrumbs from '../components/MrBreadcrumbs';
import ScrollToTop from '../components/shared/ScrollToTop';
import PhrRefresh from '../components/shared/PhrRefresh';
import { HeaderSectionProvider } from '../context/HeaderSectionContext';

import { flagsLoadedAndMhvEnabled } from '../util/selectors';
import { downtimeNotificationParams } from '../util/constants';

const App = ({ children }) => {
  const user = useSelector(selectUser);

  const { featureTogglesLoading } = useSelector(
    flagsLoadedAndMhvEnabled,
    state => state.featureToggles,
  );

  const dispatch = useDispatch();
  const location = useLocation();
  const { measuredRef, isHidden } = useBackToTop(location);
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

  const statusPollBeginDate = useSelector(
    state => state.mr.refresh.statusPollBeginDate,
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

  const handleDdRumBeforeSend = event => {
    const customEvent = { ...event };
    if (customEvent._dd.action?.target?.selector?.includes('VA-BREADCRUMBS')) {
      customEvent.action.target.name = 'Breadcrumb';
    }
    return customEvent;
  };

  const datadogRumConfig = {
    applicationId: '04496177-4c70-4caf-9d1e-de7087d1d296',
    clientToken: 'pubf11b8d8bfe126a01d84e01c177a90ad3',
    site: 'ddog-gov.com',
    service: 'va.gov-mhv-medical-records',
    sessionSampleRate: 100, // controls the percentage of overall sessions being tracked
    sessionReplaySampleRate: 50, // is applied after the overall sample rate, and controls the percentage of sessions tracked as Browser RUM & Session Replay
    trackInteractions: true,
    trackFrustrations: true,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask',
    enablePrivacyForActionName: true,
    beforeSend: event => {
      handleDdRumBeforeSend(event);
    },
  };
  useDatadogRum(datadogRumConfig);

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

  return (
    <RequiredLoginView user={user}>
      <MhvServiceRequiredGuard
        user={user}
        serviceRequired={[backendServices.MEDICAL_RECORDS]}
      >
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
              <HeaderSectionProvider>
                <MrBreadcrumbs />
                <div className="vads-l-row">
                  <div className="medium-screen:vads-l-col--8">{children}</div>
                </div>
              </HeaderSectionProvider>
            )}
            <va-back-to-top
              class="no-print"
              hidden={isHidden}
              data-dd-privacy="mask"
              data-dd-action-name="Back to top"
              data-testid="mr-back-to-top"
            />
            <ScrollToTop />
            <PhrRefresh statusPollBeginDate={statusPollBeginDate} />
          </div>
        </>
      </MhvServiceRequiredGuard>
    </RequiredLoginView>
  );
};

App.propTypes = {
  children: PropTypes.object,
};

export default App;
