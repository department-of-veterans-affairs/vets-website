import React from 'react';
import Wrapper from '../layout/Wrapper';
import CardSection from '../components/CardSection';

const Confirmation = () => {
  // Mocked data to come from API
  const phoneNumber = '###-###-####';
  const appointmentDateData = {
    date: new Date('2025-11-17T20:00:00Z'),
    timezone: 'America/New_York',
  };

  const handleCancelAppointment = () => {
    // TODO: Implement cancel appointment logic
  };

  return (
    <Wrapper pageTitle="Your appointment is scheduled">
      <p>We’ve confirmed your appointment.</p>
      <va-card icon-name="phone" class="vass-card-container">
        <h2 className="vass-card-title">Phone appointment</h2>
        <CardSection
          heading="How to join"
          textContent={`Your representative will call you from ${phoneNumber}. If you have questions or need to 
            reschedule, contact VA Solid Start. `}
        />
        <CardSection heading="When" dateContent={appointmentDateData} />
        <CardSection heading="What" textContent="Type of care" />
        <CardSection heading="Who" textContent="Provider name" />
        <CardSection
          heading="Topics you'd like to learn more about"
          textContent="Health care, education"
        />
        <div className="vads-u-display--flex vads-u-margin-top--4 vass-form__button-container vass-flex-direction--column">
          <div>
            <va-button
              secondary
              onClick={() => window.print()}
              text="Print"
              uswds
            />
          </div>
          <div>
            <va-button
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
