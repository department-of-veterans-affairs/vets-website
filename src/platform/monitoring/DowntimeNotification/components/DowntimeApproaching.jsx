import React from 'react';
import { format } from 'date-fns';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import externalServiceStatus from '../config/externalServiceStatus';
import DowntimeNotificationWrapper from './Wrapper';

class DowntimeApproaching extends React.Component {
  componentDidMount() {
    this.props.initializeDowntimeWarnings();
  }

  render() {
    const {
      startTime,
      endTime,
      appTitle,
      isDowntimeWarningDismissed,
      dismissDowntimeWarning,
      children,
      content,
      messaging = {},
      className = 'row-padded',
    } = this.props;
    const close = () => dismissDowntimeWarning(appTitle);
    const modalTitle =
      messaging.title ||
      `The ${appTitle} application will be down for maintenance soon`;
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
              We’ll be doing some work on the {appTitle} application on{' '}
              {format(startTime, 'MMMM do')} between {format(startTime, 'p')}{' '}
              and {format(endTime, 'p')}. If you have trouble using this tool
              during that time, please check back soon.
            </p>
          )}
        </VaModal>
        {children || content}
      </DowntimeNotificationWrapper>
    );
  }
}

export default DowntimeApproaching;
