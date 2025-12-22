import React from 'react';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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

const CancelAppointment = () => {
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
        onPrimaryClick={() => {}}
        onSecondaryClick={() => {}}
        class="vads-u-margin-top--4"
      />
    </Wrapper>
  );
};

export default CancelAppointment;
