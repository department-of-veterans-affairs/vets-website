import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
  clearCurrentSession,
  clearSelectedAppointmentData,
} from '../../../shared/utils';
import ConfirmationPageFooter from '../../components/confirmation-page-footer/ConfirmationPageFooter';
import AppointmentDisplay from '../../components/appointment-display/AppointmentDisplay';

import PrintButton from '../../../shared/components/print/PrintButton';

const ConfirmationPage = props => {
  const { context } = props;
  const { appointment } = context;

  useEffect(() => {
    clearCurrentSession(window);
    clearSelectedAppointmentData(window, appointment.id);
  }, []);

  return (
    <div className="healthcare-questionnaire-confirm">
      <div className="usa-alert usa-alert-success schemaform-sip-alert">
        <div className="usa-alert-body">
          <h2 className="usa-alert-heading">
            Your information has been sent to your provider.
          </h2>
        </div>
      </div>

      <div className="inset">
        <h2 data-testid="appointment-type-header">
          Your provider will discuss the information on your questionnaire
          during your appointment:
        </h2>
        <AppointmentDisplay appointmentData={context} bold={false} />
        <p>We look forward to seeing you at your upcoming appointment.</p>
        <PrintButton
          displayArrow={false}
          ErrorCallToAction={() => {
            return (
              <>
                Please try again from your{' '}
                <a
                  href={
                    '/health-care/health-questionnaires/questionnaires/completed'
                  }
                >
                  list of completed questionnaires.
                </a>
              </>
            );
          }}
        />
      </div>
      {appointment && <ConfirmationPageFooter context={context} />}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    form: state.form,
    context: state?.questionnaireData?.context,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
