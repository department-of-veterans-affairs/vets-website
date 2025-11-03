import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { formatDateLong } from 'platform/utilities/date';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';

export const ConfirmationPage = ({ route }) => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';
  const formattedSubmitDate = submitDate ? formatDateLong(submitDate) : '';
  const confirmationNumber = submission?.response?.confirmationNumber || '';

  const submissionAlertContent = (
    <p>
      Thank you for helping to support a claim. We’ll review your form and
      contact you if we need any additional information.
    </p>
  );

  return (
    <ConfirmationView
      formConfig={route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      pdfUrl={submission.response?.pdfUrl}
      devOnly={{
        showButtons: true,
      }}
    >
      {/* actions={<p />} removes the link to myVA */}
      <ConfirmationView.SubmissionAlert
        title={`You've submitted your nursing home information ${
          formattedSubmitDate ? `on ${formattedSubmitDate}` : ''
        }`}
        content={submissionAlertContent}
        actions={<p />}
      />
      <ConfirmationView.SavePdfDownload />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList
        item1Header="We’ll review your form"
        item1Content="If we need more information after reviewing your form, we’ll contact you."
        item1Actions={<p />}
        item2Header="We’ll send a decision on your claim"
        item2Content="We’ll contact you when we’ve made a decision on your claim."
      />
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
