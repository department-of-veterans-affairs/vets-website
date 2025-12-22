import React from 'react';
import Wrapper from '../layout/Wrapper';
import AppointmentCard from '../components/AppointmentCard';
// TODO: replace with actual data from API
const appointmentData = {
  appointmentId: 'abcdef123456',
  topics: [
    {
      topicId: '123',
      topicName: 'General Health',
    },
  ],
  dtStartUtc: '2024-07-01T14:00:00Z',
  dtEndUtc: '2024-07-01T14:30:00Z',
  providerName: 'Bill Brasky',
  typeOfCare: 'Solid Start',
};

const CancelConfirmation = () => {
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
          contact="8008270611"
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
