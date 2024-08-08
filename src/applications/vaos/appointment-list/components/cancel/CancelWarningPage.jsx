/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import BackLink from '../../../components/BackLink';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import {
  closeCancelAppointment,
  confirmCancelAppointment,
} from '../../redux/actions';
import { selectAppointmentType } from '../../redux/selectors';
import { APPOINTMENT_TYPES } from '../../../utils/constants';
import CancelPageContent from './CancelPageContent';
import AppointmentCard from '../../../components/AppointmentCard';

function handleConfirm(dispatch) {
  return () => dispatch(confirmCancelAppointment());
}

function handleClose(dispatch) {
  return () => dispatch(closeCancelAppointment());
}

export default function CancelWarningPage({ appointment, cancelInfo }) {
  const dispatch = useDispatch();
  const { showCancelModal } = cancelInfo;
  const type = selectAppointmentType(appointment);

  let heading = 'Would you like to cancel this appointment?';
  let buttonText = 'Yes, cancel appointment';
  if (
    APPOINTMENT_TYPES.request === type ||
    APPOINTMENT_TYPES.ccRequest === type
  ) {
    heading = 'Would you like to cancel this request?';
    buttonText = 'Yes, cancel request';
  }

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
        If you want to reschedule, you’ll need to call us or schedule a new
        appointment online.
      </p>
      <AppointmentCard appointment={appointment}>
        <CancelPageContent type={type} />
        <div className="vads-u-display--flex vads-u-align-items--center vads-u-margin-top--3 vaos-hide-for-print">
          <button type="button" onClick={handleConfirm(dispatch)}>
            {buttonText}
          </button>
        </div>
        <div className="vads-u-display--flex vads-u-align-items--center vaos-hide-for-print">
          <button
            type="button"
            className="usa-button-secondary"
            onClick={handleClose(dispatch)}
          >
            No, do not cancel
          </button>
        </div>
      </AppointmentCard>
    </>
  );
}
CancelWarningPage.propTypes = {
  appointment: PropTypes.object,
  cancelInfo: PropTypes.object,
};
