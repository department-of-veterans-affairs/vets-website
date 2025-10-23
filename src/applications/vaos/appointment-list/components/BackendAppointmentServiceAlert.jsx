import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectBackendServiceFailuresInfo } from '../redux/selectors';
import { FETCH_STATUS, ERROR_CODES } from '../../utils/constants';

function displayType(errorCodes, location) {
  const isPending = location.pathname.endsWith('/pending');
  const isPast = location.pathname.endsWith('/past');
  const isUpcoming = location.pathname.endsWith('/');

  if (
    errorCodes.some(
      code =>
        code === 10001 ||
        code === 10006 ||
        code === 6000 ||
        code === 9002 ||
        code === 9003 ||
        code === 9008,
    ) &&
    isPending
  ) {
    return ['requests', 'reschedule a request', 'requested'];
  }
  if (
    errorCodes.some(
      code =>
        code === 10000 ||
        code === 10005 ||
        code === 6000 ||
        code === 9006 ||
        code === 9007 ||
        code === 9008,
    ) &&
    (isPast || isUpcoming)
  ) {
    return ['appointments', 'manage an appointment', 'scheduled'];
  }
  return null;
}

export default function BackendAppointmentServiceAlert() {
  const {
    backendServiceFailures,
    futureStatus,
    pastStatus,
    pendingStatus,
  } = useSelector(state => selectBackendServiceFailuresInfo(state));
  const location = useLocation();

  if (
    futureStatus === FETCH_STATUS.succeeded ||
    pastStatus === FETCH_STATUS.succeeded ||
    pendingStatus === FETCH_STATUS.succeeded
  ) {
    const hasBackendServiceFailure = backendServiceFailures?.meta?.length > 0;

    if (hasBackendServiceFailure) {
      const dataTable = backendServiceFailures?.meta.map(el1 => ({
        code: el1.code,
        match: ERROR_CODES.some(el2 => el2.code === el1.code),
      }));

      const errorCodes = dataTable
        .filter(code => code.match === true)
        .map(code => code.code);

      const display = displayType(errorCodes, location);

      if (display !== null) {
        return (
          <div className="vads-u-margin-bottom--4">
            <va-alert-expandable
              status="warning"
              trigger={`We can’t show some of your ${display[0]} right now`}
              data-testid="backend-appointment-service-alert"
            >
              <p>
                {`We’re working to fix this problem.
                 To ${display[1]}
                that’s not in this list, contact the VA facility where it
                was ${display[2]}. `}
              </p>
              <br />
              <p>
                <a href="/find-locations">Find your VA health facility</a>
              </p>
            </va-alert-expandable>
          </div>
        );
      }
    }
  }
  return null;
}
