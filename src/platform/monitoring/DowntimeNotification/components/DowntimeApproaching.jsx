import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import externalServiceStatus from '../config/externalServiceStatus';
import DowntimeNotificationWrapper from './Wrapper';

const DowntimeApproaching = ({
  startTime,
  endTime,
  appTitle,
  isDowntimeWarningDismissed,
  dismissDowntimeWarning,
  initializeDowntimeWarnings,
  children,
  content,
  messaging = {},
  className = 'row-padded',
}) => {
  useEffect(
    () => {
      initializeDowntimeWarnings();
    },
    [initializeDowntimeWarnings],
  );

  const close = () => dismissDowntimeWarning(appTitle);
  const modalTitle =
    messaging.title || `The ${appTitle} will be down for maintenance soon`;

  return (
    <DowntimeNotificationWrapper
      status={externalServiceStatus.downtimeApproaching}
      className={className}
    >
      <VaModal
        id="downtime-approaching-modal"
        onCloseEvent={close}
        onSecondaryButtonClick={close}
        visible={!isDowntimeWarningDismissed}
        secondaryButtonText="Dismiss"
        modalTitle={modalTitle}
      >
        {messaging.content || (
          <p>
            We’ll be doing some work on the {appTitle} on{' '}
            {format(startTime, 'MMMM do')} between {format(startTime, 'p')} and{' '}
            {format(endTime, 'p')}. If you have trouble using this tool during
            that time, please check back soon.
          </p>
        )}
      </VaModal>
      {children || content}
    </DowntimeNotificationWrapper>
  );
};

DowntimeApproaching.propTypes = {
  appTitle: PropTypes.string.isRequired,
  dismissDowntimeWarning: PropTypes.func.isRequired,
  endTime: PropTypes.instanceOf(Date).isRequired,
  initializeDowntimeWarnings: PropTypes.func.isRequired,
  isDowntimeWarningDismissed: PropTypes.bool.isRequired,
  startTime: PropTypes.instanceOf(Date).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  content: PropTypes.node,
  messaging: PropTypes.shape({
    content: PropTypes.node,
    title: PropTypes.string,
  }),
};

export default DowntimeApproaching;
