import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import Wrapper from '../layout/Wrapper';
import AppointmentCard from '../components/AppointmentCard';
import {
  useGetAppointmentQuery,
  useCancelAppointmentMutation,
} from '../redux/api/vassApi';
import { FLOW_TYPES, URLS } from '../utils/constants';
import { setFlowType } from '../redux/slices/formSlice';
import {
  isCancellationFailedError,
  isMissingParameterError,
  isServerError,
} from '../utils/errors';

const getLoadingMessage = isCanceling => {
  if (isCanceling) {
    return 'Canceling appointment. This may take up to 30 seconds. Please don’t refresh the page.';
  }
  return 'Loading appointment details. This may take up to 30 seconds. Please don’t refresh the page.';
};

const CancelAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: appointmentData,
    isLoading,
    error: appointmentError,
  } = useGetAppointmentQuery({
    appointmentId,
  });
  const [
    cancelAppointment,
    { isLoading: isCanceling, error: cancelAppointmentError },
  ] = useCancelAppointmentMutation();

  const onCancelAppointment = useCallback(
    async () => {
      const result = await cancelAppointment({ appointmentId });
      if (result.error) {
        return;
      }
      navigate(
        `${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/${result.data.appointmentId}`,
      );
    },
    [cancelAppointment, appointmentId, navigate],
  );

  const onAbortCancelAppointment = useCallback(
    () => {
      dispatch(setFlowType(FLOW_TYPES.SCHEDULE));
      navigate(
        `${URLS.CONFIRMATION}/${appointmentData?.appointmentId}?details=true`,
      );
    },
    [appointmentData?.appointmentId, dispatch, navigate],
  );

  const loadingMessage = getLoadingMessage(isCanceling);

  return (
    <Wrapper
      showBackLink
      flowType={FLOW_TYPES.CANCEL}
      loading={isLoading || isCanceling}
      errorAlert={
        isCancellationFailedError(cancelAppointmentError) ||
        isMissingParameterError(cancelAppointmentError) ||
        isServerError(cancelAppointmentError) ||
        isServerError(appointmentError)
      }
      testID="cancel-appointment-page"
      pageTitle="Would you like to cancel this appointment?"
      loadingMessage={loadingMessage}
    >
      <div className="vads-u-margin-top--6">
        <AppointmentCard
          appointmentData={appointmentData}
          showAddToCalendarButton={false}
        />
      </div>
      <VaButtonPair
        data-testid="cancel-confirm-button-pair"
        leftButtonText="Yes, cancel appointment"
        rightButtonText="No, don’t cancel"
        onPrimaryClick={onCancelAppointment}
        onSecondaryClick={onAbortCancelAppointment}
        class="vads-u-margin-top--4"
      />
    </Wrapper>
  );
};

export default CancelAppointment;
