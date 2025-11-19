import React from 'react';
import Wrapper from '../layout/Wrapper';
import CardSection from '../components/CardSection';

const Confirmation = () => {
  // Mocked data to come from API
  const phoneNumber = '###-###-####';
  const appointmentDateData = {
    dateTime: '2025-11-17T20:00:00Z',
    timezone: 'America/New_York',
    phoneNumber: '8008270611',
  };

  const handleCancelAppointment = () => {
    // TODO: Implement cancel appointment logic
  };

  return (
    <Wrapper pageTitle="Your appointment is scheduled">
      <p data-testid="confirmation-message" className="vads-u-margin-bottom--5">
        We’ve confirmed your appointment.
      </p>
      <va-card
        data-testid="appointment-card"
        icon-name="phone"
        class="vass-card-container"
      >
        <h2 data-testid="appointment-type" className="vass-card-title">
          Phone appointment
        </h2>
        <CardSection
          data-testid="how-to-join-section"
          heading="How to join"
          textContent={`Your representative will call you from ${phoneNumber}. If you have questions or need to 
            reschedule, contact VA Solid Start. `}
        />
        <CardSection
          data-testid="when-section"
          heading="When"
          dateContent={appointmentDateData}
        />
        <CardSection
          data-testid="what-section"
          heading="What"
          textContent="Type of care"
        />
        <CardSection
          data-testid="who-section"
          heading="Who"
          textContent="Provider name"
        />
        <CardSection
          data-testid="topics-section"
          heading="Topics you'd like to learn more about"
          textContent="Health care, education"
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
