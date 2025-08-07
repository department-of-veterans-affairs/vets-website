import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { format } from 'date-fns';
import { dismissDowntimeWarning } from 'platform/monitoring/DowntimeNotification/actions';
import externalServiceStatus from 'platform/monitoring/DowntimeNotification/config/externalServiceStatus';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FullWidthLayout from '../FullWidthLayout';
import InfoAlert from '../InfoAlert';
import { getUserTimezoneAbbr, stripDST } from '../../utils/timezone';

const appTitle = 'VA appointments tool';

export default function DowntimeMessage(props) {
  const { startTime, endTime, status, children, description } = props;
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
              We’re making updates to the tool between{' '}
              {`${format(startTime, "EEEE, MMMM do 'at' h:mm aaaa")} ${stripDST(
                getUserTimezoneAbbr(),
              )}`}{' '}
              and{' '}
              {`${format(endTime, "EEEE, MMMM do 'at' h:mm aaaa")} ${stripDST(
                getUserTimezoneAbbr(),
              )}`}
              . We’re sorry it’s not working right now. If you need to request
              or confirm an appointment during this time, please call your local
              VA medical center. Use the{' '}
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
            notificationTitle || 'VA appointments will be down for maintenance'
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
              We’re doing work on the VA appointments tool between{' '}
              {`${format(startTime, "EEEE, MMMM do 'at' h:mm aaaa")} ${stripDST(
                getUserTimezoneAbbr(),
              )}`}{' '}
              and{' '}
              {`${format(endTime, "EEEE, MMMM do 'at' h:mm aaaa")} ${stripDST(
                getUserTimezoneAbbr(),
              )}`}
              . If you need to request or confirm an appointment during this
              time, please call your local VA medical center. Use the{' '}
              <a href="/find-locations">VA facility locator</a> to find contact
              information for your medical center.
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
  endTime: PropTypes.instanceOf(Date),
  startTime: PropTypes.instanceOf(Date),
  status: PropTypes.string,
};
