import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { formatDateLong } from 'platform/utilities/date';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { transform } from '@bio-aquia/21p-530a-interment-allowance/config/submit-transform/transform';
import DownloadFormPDF from './download-form-pdf';

/**
 * Confirmation page displayed after successful form submission
 * @param {Object} props - Component properties
 * @param {Object} props.route - Route configuration from react-router
 * @param {Object} props.route.formConfig - Form configuration object
 * @returns {React.ReactElement} Confirmation page component
 */
export const ConfirmationPage = ({ route }) => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const { data = {} } = form;
  const { formConfig } = route || {};
  const transformedData = transform(formConfig, form);
  const veteranName = data?.veteranInformation?.fullName;

  const submitDate = submission?.timestamp || '';
  const formattedSubmitDate = submitDate ? formatDateLong(submitDate) : '';
  const confirmationNumber = submission?.response?.confirmationNumber || '';

  const submissionAlertContent = (
    <p>
      After we receive your application, we’ll review your information and send
      you a letter with more information about your claim.
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
        title={`You've submitted your application for a VA interment allowance ${
          formattedSubmitDate ? `on ${formattedSubmitDate}` : ''
        }`}
        content={submissionAlertContent}
        actions={<p />}
      />
      <div className="confirmation-save-pdf-download-section">
        <h2>Save a copy of your form</h2>
        <p>
          If you’d like a PDF copy of your completed form, you can download it.{' '}
        </p>
        <DownloadFormPDF formData={transformedData} veteranName={veteranName} />
      </div>
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList
        item1Header="We’ll review your form"
        item1Content="If we need more information after reviewing your form, we’ll contact you."
        item1Actions={<p />}
        item2Header="We’ll send a decision on your claim"
        item2Content="We’ll send you a letter with our decision."
      />
      <div>
        <h2>How to submit supporting documents</h2>
        <p>
          If you still need to submit additional supporting documents, you can
          submit them by mail.
        </p>
        <p>
          Write the Veteran’s Social Security number or VA file number (if it’s
          different than their Social Security number) on the first page of the
          documents.
        </p>
        <p>Mail any supporting documents to this address: </p>
        <p className="va-address-block">
          Department of Veterans Affairs <br />
          Pension Claims Intake Center <br />
          PO Box 5365 <br />
          Janesville, WI 53547-5365 <br />
        </p>
        <p>
          <strong>Note:</strong> Mail us copies of your documents only. Don’t
          send us your original documents. We can’t return them.
        </p>
      </div>
      <ConfirmationView.HowToContact />
      <ConfirmationView.GoBackLink />
      <ConfirmationView.NeedHelp />
    </ConfirmationView>
  );
};

ConfirmationPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
};
