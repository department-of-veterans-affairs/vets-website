import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import InfoAlert from '../../../components/InfoAlert';
import {
  APPOINTMENT_STATUS,
  CANCELLATION_REASONS,
  GA_PREFIX,
} from '../../../utils/constants';
import { startNewAppointmentFlow } from '../../redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../../../new-appointment/newAppointmentFlow';
import { selectFeatureAfterVisitSummary } from '../../../redux/selectors';

function handleClick(history, dispatch, typeOfCare) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(typeOfCare.url);
  };
}

export default function StatusAlert({ appointment, facility }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const { search } = useLocation();
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);
  const featureAfterVisitSummary = useSelector(state =>
    selectFeatureAfterVisitSummary(state),
  );
  const queryParams = new URLSearchParams(search);
  const showConfirmMsg = queryParams.get('confirmMsg');

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const { isPastAppointment } = appointment.vaos;
  const avsLink = appointment.avsPath;
  const avsError = avsLink?.includes('Error');
  const displayAvsLink = () => {
    if (avsError) {
      return (
        <div
          aria-atomic="true"
          aria-live="assertive"
          className="vads-u-margin-top--2 vads-u-margin-bottom--0"
        >
          <InfoAlert
            status="error"
            level={1}
            headline="We can't access after-visit summaries at this time."
          >
            Were sorry. We’ve run into a problem.
          </InfoAlert>
        </div>
      );
    }
    return (
      <>
        <va-link
          text="Go to after-visit summary"
          href={appointment.avsPath}
          data-testid="after-vist-summary-link"
          onClick={() =>
            recordEvent({
              event: `${GA_PREFIX}-after-visit-summary-link-clicked`,
            })
          }
        />
        <br />
      </>
    );
  };

  const canceler = new Map([
    [CANCELLATION_REASONS.patient, 'You'],
    [CANCELLATION_REASONS.provider, `${facility?.name || 'Facility'}`],
  ]);

  if (canceled) {
    const who = canceler.get(appointment?.cancelationReason) || 'Facility';
    return (
      <>
        <InfoAlert status="error" backgroundOnly>
          <strong>{who} canceled your appointment. </strong>
          If you want to reschedule, call us or schedule a new appointment
          online.
        </InfoAlert>
      </>
    );
  }
  if (isPastAppointment && !featureAfterVisitSummary) {
    return (
      <InfoAlert status="warning" backgroundOnly>
        This appointment occurred in the past.
      </InfoAlert>
    );
  }
  if (isPastAppointment && !!featureAfterVisitSummary) {
    return (
      <>
        <p className="vads-u-font-size--base vads-u-font-weight--bold vads-u-font-family--sans vads-u-margin-top--2 vads-u-margin-bottom--0">
          This appointment happened in the past.
        </p>
        {avsLink && displayAvsLink()}
      </>
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
            onClick={handleClick(history, dispatch, typeOfCare)}
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
