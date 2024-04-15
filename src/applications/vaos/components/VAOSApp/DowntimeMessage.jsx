import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import externalServiceStatus from 'platform/monitoring/DowntimeNotification/config/externalServiceStatus';
import { dismissDowntimeWarning } from 'platform/monitoring/DowntimeNotification/actions';
import PropTypes from 'prop-types';
import FullWidthLayout from '../FullWidthLayout';
import InfoAlert from '../InfoAlert';

const appTitle = 'VA online scheduling tool';

export default function DowntimeMessage({
  startTime,
  endTime,
  status,
  children,
  description,
}) {
  const dispatch = useDispatch();
  const isDowntimeWarningDismissed = useSelector(state =>
    state.scheduledDowntime.dismissedDowntimeWarnings.includes(appTitle),
  );
  const splitDescription = description?.split('|');
  const notificationTitle =
    splitDescription?.length > 1 && splitDescription?.[0];
  const descriptionBody = notificationTitle
    ? splitDescription?.[1]
    : splitDescription?.[0];
  if (status === externalServiceStatus.down) {
    return (
      <FullWidthLayout>
        <InfoAlert
          className="vads-u-margin-bottom--4"
          headline={
            notificationTitle ||
            'The VA appointments tool is down for maintenance'
          }
          status="warning"
        >
          {descriptionBody ? (
            <p>{descriptionBody}</p>
          ) : (
            <p>
              We’re making updates to the tool on {startTime.format('MMMM Do')}{' '}
              between {startTime.format('LT')} and {endTime.format('LT')}. We’re
              sorry it’s not working right now. If you need to request or
              confirm an appointment during this time, please call your local VA
              medical center. Use the{' '}
              <a href="/find-locations">VA facility locator</a> to find contact
              information for your medical center.
            </p>
          )}
        </InfoAlert>
      </FullWidthLayout>
    );
  }

  const close = () => dispatch(dismissDowntimeWarning(appTitle));
  return (
    <>
      {status === externalServiceStatus.downtimeApproaching && (
        <VaModal
          id="downtime-approaching-modal"
          onCloseEvent={close}
          visible={!isDowntimeWarningDismissed}
          status="warning"
          role="alertdialog"
          modalTitle={
            notificationTitle ||
            'VA online scheduling will be down for maintenance'
          }
          data-testid="downtime-approaching-modal"
          secondaryButtonText="Dismiss"
          onSecondaryButtonClick={close}
          uswds
        >
          {descriptionBody ? (
            <p>{descriptionBody}</p>
          ) : (
            <p>
              We’re doing work on the VA appointments tool on{' '}
              {startTime.format('MMMM Do')} between {startTime.format('LT')} and{' '}
              {endTime.format('LT')}. If you need to request or confirm an
              appointment during this time, please call your local VA medical
              center. Use the <a href="/find-locations">VA facility locator</a>{' '}
              to find contact information for your medical center.
            </p>
          )}
        </VaModal>
      )}
      {children}
    </>
  );
}
DowntimeMessage.propTypes = {
  children: PropTypes.node,
  description: PropTypes.string,
  endTime: PropTypes.object,
  startTime: PropTypes.object,
  status: PropTypes.string,
};
