import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { clearCurrentSession } from '../utils';
import ConfirmationPageFooter from '../components/get-help/ConfirmationPageFooter';
import AppointmentDisplay from '../components/appointment-display/AppointmentDisplay';

import PrintButton from '../../list/questionnaire-list/components/Shared/Print/PrintButton';

const ConfirmationPage = props => {
  const { appointment } = props;

  useEffect(() => {
    clearCurrentSession(window);
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
        <AppointmentDisplay appointment={appointment} bold={false} />
        <p>We look forward to seeing you at your upcoming appointment.</p>
        <PrintButton displayArrow={false} />
      </div>
      {appointment && <ConfirmationPageFooter appointment={appointment} />}
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
