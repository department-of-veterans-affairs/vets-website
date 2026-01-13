import React from 'react';
import Wrapper from '../layout/Wrapper';
import AppointmentCard from '../components/AppointmentCard';
import { VASS_PHONE_NUMBER } from '../utils/constants';
// TODO: replace with actual data from API
const appointmentData = {
  appointmentId: 'abcdef123456',
  // Currently the appointment GET api does not return topics, so we are not mocking them
  // ideally VASS adds these values to the appointment GET api response
  // topics: [
  //   {
  //     topicId: '123',
  //     topicName: 'General Health',
  //   },
  // ],
  startUTC: '2025-12-24T10:00:00Z',
  endUTC: '2025-12-24T10:30:00Z',
  agentId: '353dd0fc-335b-ef11-bfe3-001dd80a9f48',
  agentNickname: 'Bill Brasky',
  appointmentStatusCode: 1,
  appointmentStatus: 'Confirmed',
  cohortStartUtc: '2025-12-01T00:00:00Z',
  cohortEndUtc: '2026-02-28T23:59:59Z',
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
