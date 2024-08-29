import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import InfoAlert from './InfoAlert';
import {
  APPOINTMENT_STATUS,
  CANCELLATION_REASONS,
  GA_PREFIX,
} from '../utils/constants';
import { startNewAppointmentFlow } from '../appointment-list/redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../new-appointment/newAppointmentFlow';
import {
  selectFeatureAfterVisitSummary,
  selectFeatureAppointmentDetailsRedesign,
} from '../redux/selectors';
import AfterVisitSummary from './AfterVisitSummary';

function handleClick(dispatch) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
  };
}

export default function StatusAlert({ appointment, facility }) {
  const dispatch = useDispatch();

  const { search } = useLocation();
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);
  const featureAfterVisitSummary = useSelector(state =>
    selectFeatureAfterVisitSummary(state),
  );
  const featureAppointmentDetailsRedesign = useSelector(
    selectFeatureAppointmentDetailsRedesign,
  );
  const queryParams = new URLSearchParams(search);
  const showConfirmMsg = queryParams.get('confirmMsg');

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const { isPastAppointment, isPendingAppointment } = appointment.vaos;

  const canceler = new Map([
    [CANCELLATION_REASONS.patient, 'You'],
    [CANCELLATION_REASONS.provider, `${facility?.name || 'Facility'}`],
  ]);
  const { status } = appointment;

  if (APPOINTMENT_STATUS.proposed === status) {
    return (
      <InfoAlert backgroundOnly status={showConfirmMsg ? 'success' : 'info'}>
        <p>
          We’ll try to schedule your appointment in the next 2 business days.
          Check back here or call your facility for updates.
        </p>
        {showConfirmMsg && (
          <>
            <div className="vads-u-margin-y--1">
              <va-link
                text="Review your appointments"
                data-testid="review-appointments-link"
                href={root.url}
                onClick={() =>
                  recordEvent({
                    event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
                  })
                }
              />
            </div>
            <div>
              <va-link
                text="Schedule a new appointment"
                data-testid="schedule-appointment-link"
                onClick={handleClick(dispatch)}
                href={`${root.url}${typeOfCare.url}`}
              />
            </div>
          </>
        )}
      </InfoAlert>
    );
  }

  if (featureAfterVisitSummary && !featureAppointmentDetailsRedesign) {
    const who = canceler.get(appointment?.cancelationReason) || 'Facility';

    if (APPOINTMENT_STATUS.booked === status && isPastAppointment) {
      return (
        <>
          <h2 className="vads-u-margin-bottom--0">After visit summary</h2>
          <AfterVisitSummary data={appointment} /> <br />
        </>
      );
    }

    if (APPOINTMENT_STATUS.proposed === status) {
      if (isPastAppointment) {
        return (
          <InfoAlert backgroundOnly status="info">
            <p>
              We’ll try to schedule your appointment in the next 2 business
              days. Check back here or call your facility for updates.
            </p>
          </InfoAlert>
        );
      }
      return (
        <InfoAlert backgroundOnly status="success">
          <p>
            We’ll try to schedule your appointment in the next 2 business days.
            Check back here or call your facility for updates.
          </p>
          <div className="vads-u-margin-y--1">
            <va-link
              text="Review your appointments"
              data-testid="review-appointments-link"
              href={root.url}
              onClick={() =>
                recordEvent({
                  event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
                })
              }
            />
          </div>
          <div>
            <va-link
              text="Schedule a new appointment"
              data-testid="schedule-appointment-link"
              onClick={handleClick(dispatch)}
              href={`${root.url}${typeOfCare.url}`}
            />
          </div>
        </InfoAlert>
      );
    }

    if (APPOINTMENT_STATUS.cancelled === status) {
      return (
        <InfoAlert backgroundOnly status="error">
          <strong>{`${who} canceled this appointment. `}</strong>
          {isPendingAppointment
            ? 'If you still need an appointment, call us or request a new appointment online.'
            : 'If you want to reschedule, call us or schedule a new appointment online.'}
          <br />
          <br />
          <va-link
            text="Schedule a new appointment"
            data-testid="schedule-appointment-link"
            onClick={handleClick(dispatch)}
            href={`${root.url}${typeOfCare.url}`}
          />
        </InfoAlert>
      );
    }
  }

  if (canceled) {
    const who = canceler.get(appointment?.cancelationReason) || 'Facility';
    return (
      <>
        <InfoAlert status="error" backgroundOnly>
          <strong>{who} canceled this appointment. </strong>
          If you want to reschedule, call us or schedule a new appointment
          online.
          {featureAppointmentDetailsRedesign && (
            <>
              <br />
              <br />
              <va-link
                text="Schedule a new appointment"
                data-testid="schedule-appointment-link"
                onClick={handleClick(dispatch)}
                href={`${root.url}${typeOfCare.url}`}
              />
            </>
          )}
        </InfoAlert>
      </>
    );
  }
  if (isPastAppointment && !featureAppointmentDetailsRedesign) {
    return (
      <InfoAlert status="warning" backgroundOnly>
        This appointment occurred in the past.
      </InfoAlert>
    );
  }
  if (showConfirmMsg) {
    return (
      <InfoAlert backgroundOnly status="success">
        <strong>We’ve scheduled and confirmed your appointment.</strong>
        <br />
        <div className="vads-u-margin-y--1">
          <va-link
            text="Review your appointments"
            data-testid="review-appointments-link"
            href={root.url}
            onClick={() =>
              recordEvent({
                event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
              })
            }
          />
        </div>
        <div>
          <va-link
            text="Schedule a new appointment"
            data-testid="schedule-appointment-link"
            onClick={handleClick(dispatch)}
            href={`${root.url}${typeOfCare.url}`}
          />
        </div>
      </InfoAlert>
    );
  }

  return null;
}

StatusAlert.propTypes = {
  appointment: PropTypes.shape({
    status: PropTypes.string.isRequired,
    cancelationReason: PropTypes.string,
    avsPath: PropTypes.string,
    vaos: PropTypes.shape({
      isPastAppointment: PropTypes.bool.isRequired,
      isPendingAppointment: PropTypes.bool.isRequired,
    }),
  }),
  facility: PropTypes.shape({
    name: PropTypes.string,
  }),
};
StatusAlert.defaultProps = {
  appointment: {
    status: 'booked',
    cancelationReason: '',
    avsPath: null,
    vaos: {
      isPastAppointment: false,
    },
  },
  facility: {
    name: '',
  },
};
