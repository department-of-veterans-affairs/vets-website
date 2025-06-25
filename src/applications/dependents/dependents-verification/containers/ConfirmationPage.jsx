import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { selectProfile } from 'platform/user/selectors';

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const { userFullName = {} } = useSelector(selectProfile);
  const { first = '', middle = '', last = '', suffix = '' } = userFullName;
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';
  const confirmationNumber = submission?.response?.confirmationNumber || 'N/A';

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      pdfUrl={submission.response?.pdfUrl}
      devOnly={{
        showButtons: true,
      }}
    >
      <ConfirmationView.SubmissionAlert />
      <va-summary-box>
        <h3 slot="headline">Your submission information</h3>
        <p>
          <strong>Veteran’s name</strong>
        </p>
        <p className="dd-privacy-hidden" data-dd-action-name="Veteran's name">
          {first} {middle} {last} {suffix}
        </p>
        <p>
          <strong>Date submitted</strong>
        </p>
        <p data-testid="dateSubmitted">{submitDate}</p>
        <va-button
          text="Print this page for your records"
          onClick={() => {
            window.print();
          }}
        />
      </va-summary-box>
      <ConfirmationView.WhatsNextProcessList />
      <ConfirmationView.HowToContact />
      <ConfirmationView.GoBackLink />
      <ConfirmationView.NeedHelp />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.object,
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

export default ConfirmationPage;
