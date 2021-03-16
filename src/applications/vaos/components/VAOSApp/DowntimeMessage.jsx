import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import externalServiceStatus from 'platform/monitoring/DowntimeNotification/config/externalServiceStatus';
import * as actions from 'platform/monitoring/DowntimeNotification/actions';
import FullWidthLayout from '../FullWidthLayout';

const appTitle = 'VA online scheduling tool';

function DowntimeMessage({
  startTime,
  endTime,
  status,
  children,
  isDowntimeWarningDismissed,
  dismissDowntimeWarning,
}) {
  if (status === externalServiceStatus.down) {
    return (
      <FullWidthLayout>
        <AlertBox
          className="vads-u-margin-bottom--4"
          headline="The VA appointments tool is down for maintenance"
          isVisible
          status="warning"
        >
          <p>
            We’re making updates to the tool on {startTime.format('MMMM Do')}{' '}
            between {startTime.format('LT')} and {endTime.format('LT')}. We’re
            sorry it’s not working right now. If you need to request or confirm
            an appointment during this time, please call your local VA medical
            center. Use the <a href="/find-locations">VA facility locator</a> to
            find contact information for your medical center.
          </p>
        </AlertBox>
      </FullWidthLayout>
    );
  }

  const close = () => dismissDowntimeWarning(appTitle);
  return (
    <>
      {status === externalServiceStatus.downtimeApproaching && (
        <Modal
          id="downtime-approaching-modal"
          onClose={close}
          visible={!isDowntimeWarningDismissed}
        >
          <h3>VA online scheduling will be down for maintenance</h3>
          <p>
            We’re doing work on the VA appointments tool on{' '}
            {startTime.format('MMMM Do')} between {startTime.format('LT')} and{' '}
            {endTime.format('LT')}. If you need to request or confirm an
            appointment during this time, please call your local VA medical
            center. Use the <a href="/find-locations">VA facility locator</a> to
            find contact information for your medical center.
          </p>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={close}
          >
            Dismiss
          </button>
        </Modal>
      )}
      {children}
    </>
  );
}

function mapStateToProps(state) {
  return {
    isDowntimeWarningDismissed: state.scheduledDowntime.dismissedDowntimeWarnings.includes(
      appTitle,
    ),
  };
}

const mapDispatchToProps = {
  dismissDowntimeWarning: actions.dismissDowntimeWarning,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DowntimeMessage);
