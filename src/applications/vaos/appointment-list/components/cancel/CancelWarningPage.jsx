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
      <div className="vads-u-display--flex vads-u-align-items--center vads-u-color--link-default vads-u-margin-top--3 vaos-hide-for-print">
        <va-button
          text="Yes, cancel appointment"
          label="Cancel appointment"
          className="vaos-appts__cancel-btn va-button-link vads-u-flex--0"
          onClick={handleConfirm(dispatch)}
        />
      </div>
      <div className="vads-u-display--flex vads-u-align-items--center vads-u-color--link-default vads-u-margin-top--3 vaos-hide-for-print">
        <va-button
          text="No, do not cancel"
          label="Do not cancel appointment"
          secondary
          className="vaos-appts__cancel-btn va-button-link vads-u-flex--0"
          onClick={handleClose(dispatch)}
        />
      </div>
    </PageLayout>
  );
}
