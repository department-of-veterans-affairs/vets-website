import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import environment from '~/platform/utilities/environment';

function SubmissionContent({ confirmationNumber }) {
  return (
    <>
      <p>
        Your submission is in progress. Your confirmation number is{' '}
        {confirmationNumber}.
      </p>
    </>
  );
}

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form);
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';
  const confirmationNumber =
    submission?.response?.attributes?.confirmationNumber || '';

  return (
    <ConfirmationView
      formConfig={props.route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      pdfUrl={`${
        environment.API_URL
      }/v0/education_benefits_claims/download_pdf/${submission.response?.id}`}
      devOnly={{
        showButtons: true,
      }}
    >
      <ConfirmationView.SubmissionAlert
        content={<SubmissionContent confirmationNumber={confirmationNumber} />}
        actions={<></>}
      />
      <ConfirmationView.WhatsNextProcessList item1Actions={<></>} />
      <ConfirmationView.GoBackLink />
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
