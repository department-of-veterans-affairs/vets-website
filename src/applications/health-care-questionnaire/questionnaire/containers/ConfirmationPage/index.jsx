import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import {
  clearCurrentSession,
  clearSelectedAppointmentData,
} from '../../../shared/utils';
import ConfirmationPageFooter from '../../components/confirmation-page-footer/ConfirmationPageFooter';
import AppointmentDisplay from '../../components/appointment-display/AppointmentDisplay';
import {
  selectQuestionnaireContext,
  selectQuestionnaireResponseFromResponse,
} from '../../../shared/redux-selectors';

import PrintButton from '../../../shared/components/print/PrintButton';
import { focusElement } from 'platform/utilities/ui';

const ConfirmationPage = props => {
  const { context, response } = props;

  const { appointment } = context;
  useEffect(
    () => {
      clearCurrentSession(window);
      clearSelectedAppointmentData(window, appointment.id);
      focusElement('h2.usa-alert-heading');
    },
    [appointment.id, response.id],
  );

  return (
    <div className="healthcare-questionnaire-confirm">
      <va-alert status="success">
        <h3 slot="headline">
          Your information has been sent to your provider.
        </h3>
      </va-alert>
      <div className="inset">
        <h2 data-testid="appointment-type-header">
          Your provider will discuss the information on your questionnaire
          during your appointment:
        </h2>
        <AppointmentDisplay appointmentData={context} />
        <p>We look forward to seeing you at your upcoming appointment.</p>
        <PrintButton
          questionnaireResponseId={response.id}
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
    context: selectQuestionnaireContext(state),
    response: selectQuestionnaireResponseFromResponse(state),
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
