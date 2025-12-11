import React from 'react';
import { useParams } from 'react-router-dom-v5-compat';
import Wrapper from '../layout/Wrapper';
import CardSection from '../components/CardSection';
import { useGetAppointmentQuery } from '../redux/api/vassApi';

const Confirmation = () => {
  const { appointmentId } = useParams();
  const { data: appointmentData, isLoading, isError } = useGetAppointmentQuery({
    appointmentId,
  });
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
      <va-card
        data-testid="appointment-card"
        icon-name="phone"
        className="vads-u-padding-x--2p5 vads-u-padding-bottom--2p5"
      >
        <h2
          data-testid="appointment-type"
          className="vads-u-margin-top--0 vads-u-font-size--sans-lg"
        >
          Phone appointment
        </h2>
        <CardSection
          data-testid="how-to-join-section"
          heading="How to join"
          textContent={`Your representative will call you from ${
            appointmentData?.phoneNumber
          }. If you have questions or need to 
            reschedule, contact VA Solid Start. `}
        />
        <CardSection
          data-testid="when-section"
          heading="When"
          dateContent={{
            dateTime: appointmentData?.dtStartUtc,
            timezone: browserTimezone,
            phoneNumber: appointmentData?.phoneNumber,
          }}
        />
        <CardSection
          data-testid="what-section"
          heading="What"
          textContent={
            appointmentData?.typeOfCare || 'No type of care selected'
          }
        />
        <CardSection
          data-testid="who-section"
          heading="Who"
          textContent={
            appointmentData?.providerName || 'No provider name selected'
          }
        />
        <CardSection
          data-testid="topics-section"
          heading="Topics you'd like to learn more about"
          textContent={
            (appointmentData?.topics || [])
              .map(topic => topic?.topicName || '')
              .join(', ') || 'No topics selected'
          }
        />
        <div className="vads-u-display--flex vads-u-margin-top--4 vass-form__button-container vass-flex-direction--column vass-hide-for-print">
          <div>
            <va-button
              data-testid="print-button"
              secondary
              onClick={() => window.print()}
              text="Print"
              uswds
            />
          </div>
          <div>
            <va-button
              data-testid="cancel-button"
              secondary
              onClick={handleCancelAppointment}
              text="Cancel appointment"
              uswds
            />
          </div>
        </div>
      </va-card>
    </Wrapper>
  );
};

export default Confirmation;
