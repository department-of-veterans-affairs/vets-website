import React from 'react';
import { useParams } from 'react-router-dom-v5-compat';
import Wrapper from '../layout/Wrapper';
import AppointmentCard from '../components/AppointmentCard';
import { VASS_PHONE_NUMBER } from '../utils/constants';
import { useGetAppointmentQuery } from '../redux/api/vassApi';

const CancelConfirmation = () => {
  const { appointmentId } = useParams();
  const { data: appointmentData, isLoading } = useGetAppointmentQuery({
    appointmentId,
  });
  if (isLoading || !appointmentData) {
    // TODO: is there a loading screen?
    return null;
  }
  return (
    <Wrapper
      testID="cancel-confirmation-page"
      pageTitle="You have canceled your appointment"
    >
      <p
        className="vads-u-margin-bottom--4"
        data-testid="cancel-confirmation-message"
      >
        If you need to reschedule, call us at{' '}
        <va-telephone
          data-testid="cancel-confirmation-phone"
          contact={VASS_PHONE_NUMBER}
        />
        . We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
      <div className="vads-u-margin-top--8">
        <AppointmentCard appointmentData={appointmentData} />
      </div>
    </Wrapper>
  );
};

export default CancelConfirmation;
