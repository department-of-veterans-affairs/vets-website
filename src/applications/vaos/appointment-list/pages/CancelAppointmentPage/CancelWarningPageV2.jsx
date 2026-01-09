/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppointmentCard from '../../../components/AppointmentCard/indexV2';
import BackLink from '../../../components/BackLinkV2';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';

import CancelPageContent from './CancelPageContentV2';

function handleConfirm(dispatch, setIsCancelConfirm, setIsCancelWarning) {
  return () => {
    setIsCancelWarning(false);
    setIsCancelConfirm(true);
    // dispatch(confirmCancelAppointment());
  };
}

function handleClose(dispatch, setIsCancelConfirm, setIsCancelWarning) {
  return () => {
    setIsCancelWarning(false);
    setIsCancelConfirm(false);
    // dispatch(closeCancelAppointment());
  };
}

export default function CancelWarningPage({
  data: appointment,
  setIsCancelConfirm,
  setIsCancelWarning,
}) {
  const dispatch = useDispatch();
  //   const { showCancelModal } = cancelInfo;
  const { isPendingAppointment } = appointment;

  let heading = 'Would you like to cancel this appointment?';
  let buttonText = 'Yes, cancel appointment';
  if (isPendingAppointment) {
    heading = 'Would you like to cancel this request?';
    buttonText = 'Yes, cancel request';
  }

  useEffect(() => {
    scrollAndFocus();
  }, []);

  return (
    <>
      <BackLink appointment={appointment} />
      <h1 className="vads-u-margin-y--2p5">{heading}</h1>
      <p>
        If you want to reschedule, you’ll need to call us or schedule a new
        appointment online.
      </p>
      <AppointmentCard appointment={appointment}>
        <CancelPageContent data={appointment} />
        <div className="vads-u-display--flex vads-u-align-items--center vads-u-margin-top--3 vaos-hide-for-print">
          <button
            type="button"
            onClick={handleConfirm(
              dispatch,
              setIsCancelConfirm,
              setIsCancelWarning,
            )}
          >
            {buttonText}
          </button>
        </div>
        <div className="vads-u-display--flex vads-u-align-items--center vaos-hide-for-print">
          <button
            type="button"
            className="usa-button-secondary"
            onClick={handleClose(
              dispatch,
              setIsCancelConfirm,
              setIsCancelWarning,
            )}
          >
            No, do not cancel
          </button>
        </div>
      </AppointmentCard>
    </>
  );
}
CancelWarningPage.propTypes = {
  setIsCancelConfirm: PropTypes.func.isRequired,
  setIsCancelWarning: PropTypes.func.isRequired,
  data: PropTypes.object,
};
