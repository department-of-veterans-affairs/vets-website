import React from 'react';
import PropTypes from 'prop-types';
import CardSection from './CardSection';
import { VASS_PHONE_NUMBER } from '../utils/constants';
/**
 * @typedef {import('../utils/appointments').Appointment} Appointment
 */

/**
 * Renders a card for an appointment.
 * @param {Object} props
 * @param {Appointment} props.appointmentData - The appointment data
 * @param {Function} props.handleCancelAppointment - The function to handle canceling the appointment
 * @param {boolean} props.showAddToCalendarButton - Whether to show the add to calendar button
 * @returns {JSX.Element}
 */
const AppointmentCard = ({
  appointmentData,
  handleCancelAppointment,
  showAddToCalendarButton,
}) => {
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
        customBodyElement={
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            Your representative will call you from{' '}
            <va-telephone
              contact={VASS_PHONE_NUMBER}
              data-testid="solid-start-telephone"
            />
            . If you have questions or need to reschedule, contact VA Solid
            Start.
          </p>
        }
      />
      {appointmentData?.startUTC && (
        <CardSection
          data-testid="when-section"
          heading="When"
          appointmentData={appointmentData}
          showAddToCalendarButton={showAddToCalendarButton}
        />
      )}
      <CardSection
        data-testid="what-section"
        heading="What"
        textContent="VA Solid Start"
      />
      <CardSection
        data-testid="who-section"
        heading="Who"
        textContent={
          appointmentData?.agentNickname || 'VA Solid Start representative'
        }
      />
      {appointmentData?.topics &&
        appointmentData?.topics.length > 0 && (
          <CardSection
            data-testid="topics-section"
            heading="Topics you’d like to learn more about"
            textContent={appointmentData?.topics
              .map(topic => topic?.topicName || '')
              .join(', ')}
          />
        )}
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
  showAddToCalendarButton: PropTypes.bool,
};
