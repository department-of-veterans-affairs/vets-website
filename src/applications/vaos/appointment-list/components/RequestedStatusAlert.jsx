import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { useDispatch, useSelector } from 'react-redux';
import InfoAlert from '../../components/InfoAlert';
import {
  APPOINTMENT_STATUS,
  CANCELLATION_REASONS,
  GA_PREFIX,
} from '../../utils/constants';
import { startNewAppointmentFlow } from '../redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../../new-appointment/newAppointmentFlow';

function handleClick(history, dispatch, typeOfCare) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-another-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(typeOfCare.url);
  };
}

export default function RequestedStatusAlert({ appointment, facility }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);

  const queryParams = new URLSearchParams(search);
  const showConfirmMsg = queryParams.get('confirmMsg');

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;

  const canceler = new Map([
    [CANCELLATION_REASONS.patient, 'You'],
    [CANCELLATION_REASONS.provider, `${facility?.name || 'Facility'}`],
  ]);
  // when cancelationReason is empty then default to Facility
  const who = canceler.get(appointment?.cancelationReason) || 'Facility';

  if (showConfirmMsg) {
    return (
      <InfoAlert backgroundOnly status={canceled ? 'error' : 'success'}>
        {canceled && (
          <>
            <strong>{who} canceled this request. </strong>
            If you still need an appointment, call us or request a new
            appointment online.
          </>
        )}
        {!canceled && (
          <>
            <strong>Your appointment request has been submitted. </strong>
            We will review your request and contact you to schedule the first
            available appointment.
            <br />
            <div className=" vads-u-margin-top--1">
              <va-link
                href={root.url}
                onClick={() =>
                  recordEvent({
                    event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
                  })
                }
                text="View your appointments"
                data-testid="view-appointments-link"
              />
            </div>
            <div className=" vads-u-margin-top--1">
              <va-link
                onClick={handleClick(history, dispatch, typeOfCare)}
                text="New appointment"
                data-testid="new-appointment-link"
              />
            </div>
          </>
        )}
      </InfoAlert>
    );
  }
  if (!showConfirmMsg) {
    return (
      <InfoAlert backgroundOnly status={canceled ? 'error' : 'info'}>
        {!canceled &&
          'The time and date of this appointment are still to be determined.'}
        {canceled && (
          <>
            <strong>{who} canceled this request. </strong>
            If you still need an appointment, call us or request a new
            appointment online.
          </>
        )}
      </InfoAlert>
    );
  }

  return null;
}

RequestedStatusAlert.propTypes = {
  appointment: PropTypes.object.isRequired,
  facility: PropTypes.object,
};
