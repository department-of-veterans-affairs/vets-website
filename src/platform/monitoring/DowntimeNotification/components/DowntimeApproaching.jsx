import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';
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
    } = this.props;
    const close = () => dismissDowntimeWarning(appTitle);
    return (
      <DowntimeNotificationWrapper
        status={externalServiceStatus.downtimeApproaching}
      >
        <Modal
          id="downtime-approaching-modal"
          onClose={close}
          visible={!isDowntimeWarningDismissed}
        >
          {messaging.title || (
            <h3>The {appTitle} will be down for maintenance soon</h3>
          )}
          {messaging.content || (
            <p>
              We’ll be doing some work on the {appTitle} on{' '}
              {startTime.format('MMMM Do')} between {startTime.format('LT')} and{' '}
              {endTime.format('LT')} If you have trouble using this tool during
              that time, please check back soon.
            </p>
          )}
          <button
            type="button"
            className="usa-button-secondary"
            onClick={close}
          >
            Dismiss
          </button>
        </Modal>
        {children || content}
      </DowntimeNotificationWrapper>
    );
  }
}

export default DowntimeApproaching;
