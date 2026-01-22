import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { format, isValid } from 'date-fns';

export const ConfirmationPage = props => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';
  const confirmationNumber = submission?.response?.confirmationNumber || '';

  return (
    <ConfirmationView
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      formConfig={props.route?.formConfig}
      pdfUrl={submission.response?.pdfUrl}
      devOnly={{
        showButtons: true,
      }}
    >
      <ConfirmationView.SubmissionAlert
        title={`You've submitted your application for Veteran Readiness and Employment (VR&E)${
          isValid(submitDate) ? ` on ${format(submitDate, 'MMMM d, yyyy')}` : ''
        }`}
        content={
          <p>
            We’ve recieved your VR&E application (VA Form 28-1900). After we
            complete our review, we’ll mail you a decision letter with the
            details of our decision.
            {confirmationNumber &&
              ` Your confirmation number is ${confirmationNumber}.`}
          </p>
        }
        actions=""
      />
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
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
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};

export default ConfirmationPage;
