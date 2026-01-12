import React from 'react';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import Wrapper from '../layout/Wrapper';
import AppointmentCard from '../components/AppointmentCard';
import { useGetAppointmentQuery } from '../redux/api/vassApi';

const CancelAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { data: appointmentData, isLoading } = useGetAppointmentQuery({
    appointmentId,
  });

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
        <AppointmentCard appointmentData={appointmentData} />
      </div>
      <VaButtonPair
        data-testid="cancel-confirm-button-pair"
        leftButtonText="Yes, cancel appointment"
        rightButtonText="No, don’t cancel"
        onPrimaryClick={() => {
          navigate('/cancel-appointment/confirmation');
        }}
        onSecondaryClick={() => {
          navigate(
            `/confirmation/${appointmentData.appointmentId}?details=true`,
          );
        }}
        class="vads-u-margin-top--4"
      />
    </Wrapper>
  );
};

export default CancelAppointment;
