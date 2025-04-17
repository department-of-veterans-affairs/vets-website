import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import recordEvent from 'platform/monitoring/record-event';

import {
  selectFeatureApplication,
  selectFeatureToggleLoading,
} from '../../redux/selectors';
import AppUnavailable from './AppUnavailable';
import DowntimeMessage from './DowntimeMessage';
import FullWidthLayout from '../FullWidthLayout';

export default function VAOSApp({ children }) {
  const showApplication = useSelector(state => selectFeatureApplication(state));
  const loadingFeatureToggles = useSelector(state =>
    selectFeatureToggleLoading(state),
  );
  useEffect(() => {
    recordEvent({
      event: 'phased-roll-out-enabled',
      'product-description': 'VAOS - Facility Selection v2',
    });
  }, []);

  return (
    <>
      {loadingFeatureToggles && (
        <FullWidthLayout>
          <va-loading-indicator />
        </FullWidthLayout>
      )}
      {!loadingFeatureToggles && showApplication && (
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
