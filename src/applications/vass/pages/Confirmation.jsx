import React from 'react';
import { useParams } from 'react-router-dom-v5-compat';
import Wrapper from '../layout/Wrapper';
import AppointmentCard from '../components/AppointmentCard';
import { useGetAppointmentQuery } from '../redux/api/vassApi';

const Confirmation = () => {
  const { appointmentId } = useParams();
  const { data: appointmentData, isLoading, isError } = useGetAppointmentQuery({
    appointmentId,
  });

  const handleCancelAppointment = () => {
    // TODO: Implement cancel appointment logic
  };

  if (isLoading) {
    // TODO: is there a loading screen?
    return null;
  }
  if (isError) {
    return <div>Error</div>;
  }

  return (
    <Wrapper
      testID="confirmation-page"
      pageTitle="Your appointment is scheduled"
    >
      <p data-testid="confirmation-message" className="vads-u-margin-bottom--5">
        We’ve confirmed your appointment.
      </p>
      <AppointmentCard
        appointmentData={{
          ...appointmentData,
          showAddToCalendarButton: true,
        }}
        handleCancelAppointment={handleCancelAppointment}
      />
    </Wrapper>
  );
};

export default Confirmation;
