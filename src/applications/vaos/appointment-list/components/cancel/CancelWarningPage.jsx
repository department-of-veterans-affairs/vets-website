/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BackLink from '../../../components/BackLink';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import {
  closeCancelAppointment,
  confirmCancelAppointment,
} from '../../redux/actions';
import { selectRequestedAppointmentDetails } from '../../redux/selectors';
import PageLayout from '../PageLayout';
import CancelPageLayout from './CancelPageLayout';

function handleConfirm(dispatch) {
  return () => dispatch(confirmCancelAppointment());
}

function handleClose(dispatch) {
  return () => dispatch(closeCancelAppointment());
}

export default function CancelWarningPage() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { cancelInfo, appointment } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );

  const { showCancelModal } = cancelInfo;

  useEffect(() => {
    scrollAndFocus();
  }, []);

  if (!showCancelModal) {
    return null;
  }

  return (
    <PageLayout showNeedHelp>
      <BackLink appointment={appointment} featureAppointmentDetailsRedesign />
      <h1 className="vads-u-margin-y--2p5">
        Would you like to cancel this request?
      </h1>
      <p>
        If you want to reschedule, you’ll need to call us or schedule a new
        appointment online.
      </p>
      <CancelPageLayout />
      <div className="vads-u-display--flex vads-u-align-items--center vads-u-margin-top--3 vaos-hide-for-print">
        <button
          type="button"
          aria-label="Cancel appointment"
          onClick={handleConfirm(dispatch)}
        >
          Yes, cancel appointment
        </button>
      </div>
      <div className="vads-u-display--flex vads-u-align-items--center vaos-hide-for-print">
        <button
          type="button"
          aria-label="Cancel appointment"
          className="usa-button-secondary"
          onClick={handleClose(dispatch)}
        >
          No, do not cancel
        </button>
      </div>
    </PageLayout>
  );
}
