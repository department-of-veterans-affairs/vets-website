import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';
  const confirmationNumber = submission?.response?.confirmationNumber || '';

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      pdfUrl={submission.response?.pdfUrl}
    >
      <ConfirmationView.SubmissionAlert
        content={
          <p>
            Your submission is in progress.
            {confirmationNumber &&
              ` Your confirmation number is ${confirmationNumber}.`}
          </p>
        }
        actions={null}
      />
      <ConfirmationView.WhatsNextProcessList
        item1Content="When we receive your form, we'll send you an email."
        item1Actions={null}
      />
      <ConfirmationView.GoBackLink />
      <va-button
        class="vads-u-margin-y--3"
        text="Print this page"
        onClick={() => window.print()}
      />
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
