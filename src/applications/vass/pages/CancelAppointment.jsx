import React, { useCallback } from 'react';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import Wrapper from '../layout/Wrapper';
import AppointmentCard from '../components/AppointmentCard';
import {
  useGetAppointmentQuery,
  useCancelAppointmentMutation,
} from '../redux/api/vassApi';
import { URLS } from '../utils/constants';

const CancelAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { data: appointmentData, isLoading } = useGetAppointmentQuery({
    appointmentId,
  });
  const [cancelAppointment] = useCancelAppointmentMutation();

  const onCancelAppointment = useCallback(
    async () => {
      try {
        await cancelAppointment({ appointmentId });
        navigate(`${URLS.CANCEL_APPOINTMENT_CONFIRMATION}/${appointmentId}`);
      } catch (error) {
        // TODO: handle error
      }
    },
    [appointmentId, cancelAppointment, navigate],
  );

  if (isLoading || !appointmentData) {
    // TODO: is there a loading screen?
    return null;
  }

  return (
    <Wrapper
      showBackLink
      testID="cancel-appointment-page"
      pageTitle="Would you like to cancel this appointment?"
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
        onSecondaryClick={() => {
          navigate(
            `${URLS.CONFIRMATION}/${
              appointmentData.appointmentId
            }?details=true`,
          );
        }}
        class="vads-u-margin-top--4"
      />
    </Wrapper>
  );
};

export default CancelAppointment;
