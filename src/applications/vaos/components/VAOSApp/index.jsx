import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import recordEvent from 'platform/monitoring/record-event';

import {
  selectFeatureApplication,
  selectFeatureToggleLoading,
  selectUseFlatFacilityPage,
} from '../../redux/selectors';
import AppUnavailable from './AppUnavailable';
import DowntimeMessage from './DowntimeMessage';
import FullWidthLayout from '../FullWidthLayout';

function VAOSApp({
  children,
  showApplication,
  loadingFeatureToggles,
  useFlatFacilityPage,
}) {
  useEffect(
    () => {
      if (useFlatFacilityPage) {
        recordEvent({
          event: 'phased-roll-out-enabled',
          'product-description': 'VAOS - Facility Selection v2',
        });
      }
    },
    [useFlatFacilityPage],
  );

  return (
    <>
      {loadingFeatureToggles && (
        <FullWidthLayout>
          <LoadingIndicator />
        </FullWidthLayout>
      )}
      {!loadingFeatureToggles &&
        showApplication && (
          <DowntimeNotification
            appTitle="VA online scheduling tool"
            dependencies={[externalServices.mvi, externalServices.vaos]}
            render={(props, childContent) => (
              <DowntimeMessage {...props}>{childContent}</DowntimeMessage>
            )}
          >
            {children}
          </DowntimeNotification>
        )}
      {!loadingFeatureToggles && !showApplication && <AppUnavailable />}
    </>
  );
}

function mapStateToProps(state) {
  return {
    showApplication: selectFeatureApplication(state),
    loadingFeatureToggles: selectFeatureToggleLoading(state),
    useFlatFacilityPage: selectUseFlatFacilityPage(state),
  };
}

export default connect(mapStateToProps)(VAOSApp);
