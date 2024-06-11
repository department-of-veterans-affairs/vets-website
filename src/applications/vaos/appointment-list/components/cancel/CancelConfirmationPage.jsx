import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { APPOINTMENT_TYPES, GA_PREFIX } from '../../../utils/constants';
import { startNewAppointmentFlow } from '../../redux/actions';
import BackLink from '../../../components/BackLink';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../../../new-appointment/newAppointmentFlow';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { selectAppointmentType } from '../../redux/selectors';
import CancelPageContent from './CancelPageContent';
import AppointmentCard from '../../../components/AppointmentCard';

function handleClick(history, dispatch, url) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(url);
  };
}

export default function CancelConfirmationPage({ appointment, cancelInfo }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { typeOfCare: page } = useSelector(getNewAppointmentFlow);
  const { showCancelModal } = cancelInfo;
  const type = selectAppointmentType(appointment);

  let heading = 'You have canceled your appointment';
  if (
    APPOINTMENT_TYPES.request === type ||
    APPOINTMENT_TYPES.ccRequest === type
  )
    heading = 'You have canceled your request';

  useEffect(() => {
    scrollAndFocus();
  }, []);

  if (!showCancelModal) {
    return null;
  }

  return (
    <>
      <BackLink appointment={appointment} featureAppointmentDetailsRedesign />
      <h1 className="vads-u-margin-y--2p5">{heading}</h1>
      <p>
        If you still need an appointment, call us or request a new appointment
        online.
      </p>
      <a
        className="vads-c-action-link--blue vaos-hide-for-print vads-u-margin-bottom--1p5"
        href="/"
        onClick={handleClick(history, dispatch, page.url)}
      >
        Scheduling a new appointment
      </a>
      <AppointmentCard appointment={appointment}>
        <CancelPageContent type={type} />
      </AppointmentCard>
    </>
  );
}
CancelConfirmationPage.propTypes = {
  appointment: PropTypes.object,
  cancelInfo: PropTypes.object,
};
