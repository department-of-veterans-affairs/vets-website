import React, { useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';
import { getAppointTypeFromAppointment, clearCurrentSession } from '../utils';

const ConfirmationPage = props => {
  const { appointment, form } = props;
  const { submission } = form || undefined;
  const { response } = submission || {};

  const facility = appointment?.attributes?.vdsAppointments
    ? appointment.attributes.vdsAppointments[0]?.clinic.facility
    : null;
  useEffect(() => {
    clearCurrentSession(window);
  }, []);

  const appointmentType = getAppointTypeFromAppointment(appointment, {
    titleCase: true,
  });

  return (
    <div className="healthcare-questionnaire-confirm">
      <div className="usa-alert usa-alert-success schemaform-sip-alert">
        <div className="usa-alert-body">
          <h2 className="usa-alert-heading">
            Your information has been sent to your provider.
          </h2>
          <div className="usa-alert-text">
            <p>
              Your provider will discuss the information on your questionnaire
              during your appointment. We look forward to seeing you at your
              upcoming appointment.
            </p>
          </div>
        </div>
      </div>

      <div className="inset">
        <h2 data-testid="appointment-type-header">
          {appointmentType} questionnaire
        </h2>
        {response?.veteranInfo?.fullName && (
          <p>
            For{' '}
            <span
              aria-label="Veteran's full name"
              data-testid="veterans-full-name"
            >
              {response.veteranInfo.fullName}
            </span>
          </p>
        )}

        {response && (
          <ul className="claim-list">
            <li>
              <strong>Date received</strong>
              <br />
              <span>{moment(response.timestamp).format('MMMM D, YYYY')}</span>
            </li>
            <li>
              <strong>We sent your information to:</strong>
              <br />
              <span data-testid="facility-name" aria-label="Facility Name">
                {facility && facility.displayName}
              </span>
            </li>
          </ul>
        )}
        <button className="usa-button-primary">View and print questions</button>
      </div>
      {appointment && (
        <div className="next-steps">
          <h2>
            Who can I contact if I have questions about my upcoming appointment?
          </h2>
          <p>
            You can contact the {facility && facility.displayName} at
            XXX-XXX-XXXX and the {appointment.attributes.clinicFriendlyName} at{' '}
            <Telephone contact={appointment.attributes.clinicPhone} />.
          </p>
          <div className="nav-buttons">
            <a
              className="usa-button-primary"
              href="/health-care/health-questionnaires/questionnaires"
            >
              Go to your health questionnaires
            </a>
            <a
              className="appointment-details-link usa-button-primary usa-button-secondary"
              href="/health-care/schedule-view-va-appointments/appointments/"
            >
              Go to your appointment details
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    form: state.form,
    appointment: state?.questionnaireData?.context?.appointment,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
