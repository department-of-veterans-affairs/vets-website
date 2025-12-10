import React from 'react';
import PropTypes from 'prop-types';
import CardSection from './CardSection';

const AppointmentCard = ({ appointmentData, handleCancelAppointment }) => {
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
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
          showAddToCalendarButton: appointmentData?.showAddToCalendarButton,
        }}
      />
      <CardSection
        data-testid="what-section"
        heading="What"
        textContent={appointmentData?.typeOfCare || 'No type of care selected'}
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
      {handleCancelAppointment && (
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
      )}
    </va-card>
  );
};

export default AppointmentCard;

AppointmentCard.propTypes = {
  appointmentData: PropTypes.object.isRequired,
  handleCancelAppointment: PropTypes.func,
};
