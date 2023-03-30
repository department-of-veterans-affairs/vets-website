import React from 'react';
import { useSelector } from 'react-redux';
import { selectBackendServiceFailuresInfo } from '../redux/selectors';
import { FETCH_STATUS } from '../../utils/constants';

export default function BackendAppointmentServiceAlert() {
  const { backendServiceFailures, futureStatus } = useSelector(state =>
    selectBackendServiceFailuresInfo(state),
  );

  if (futureStatus === FETCH_STATUS.succeeded) {
    const hasBackendServiceFailure = backendServiceFailures?.meta?.length > 0;

    if (hasBackendServiceFailure) {
      return (
        <div className="vads-u-margin-bottom--4">
          <va-alert-expandable
            status="warning"
            trigger="We can't display all your appointments."
            data-testid="backend-appointment-service-alert"
          >
            <p>
              We're working to resolve this issue. To manage an appointment that
              is not shown in this list, contact the facility at which it was
              scheduled.
            </p>
            <p>
              <a href="/find-locations">Facility locator</a>
            </p>
          </va-alert-expandable>
        </div>
      );
    }
  }
  return null;
}
