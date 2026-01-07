import React from 'react';
import {
  useParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom-v5-compat';
import Wrapper from '../layout/Wrapper';
import AppointmentCard from '../components/AppointmentCard';
import { useGetAppointmentQuery } from '../redux/api/vassApi';

const Confirmation = () => {
  const { appointmentId } = useParams();
  const [searchParams] = useSearchParams();
  const detailsCardOnly = searchParams.get('details') === 'true';
  const navigate = useNavigate();
  const { data: appointmentData, isLoading, isError } = useGetAppointmentQuery({
    appointmentId,
  });

  const handleCancelAppointment = () => {
    navigate(`/cancel-appointment/${appointmentId}`);
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
      showBackLink={detailsCardOnly}
      pageTitle={
        detailsCardOnly
          ? undefined
          : 'Your VA Solid Start appointment is scheduled'
      }
    >
      {!detailsCardOnly && (
        <p
          data-testid="confirmation-message"
          className="vads-u-margin-bottom--5"
        >
          We’ve confirmed your appointment.
        </p>
      )}
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
