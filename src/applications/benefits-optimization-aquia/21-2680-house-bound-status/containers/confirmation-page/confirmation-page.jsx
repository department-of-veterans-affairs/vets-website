/**
 * @module containers/ConfirmationPage
 * @description Confirmation page displayed after successful form submission
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { API_ENDPOINTS } from '@bio-aquia/21-2680-house-bound-status/constants';
/**
 * Custom submission alert component that shows warning for additional steps needed
 * @returns {React.ReactElement} Warning alert component
 */
const CustomSubmissionAlert = () => {
  return (
    <va-alert
      uswds
      status="warning"
      className="confirmation-submission-alert-section vads-u-margin-bottom--4"
    >
      <h2 slot="headline" tabIndex="-1">
        Additional steps are needed
      </h2>
      <p>
        You completed your part of this application. But to process it, we need
        you to complete a few additional steps.
      </p>
    </va-alert>
  );
};

const DownloadFormPDF = ({ confirmationNumber }) => {
  // Render download link
  return (
    confirmationNumber && (
      <p>
        <va-link
          text="Download a copy of your VA Form 21-2680"
          download
          filetype="PDF"
          href={`${API_ENDPOINTS.downloadPdf}${confirmationNumber}`}
        />
      </p>
    )
  );
};

DownloadFormPDF.propTypes = {
  confirmationNumber: PropTypes.string,
};

/**
 * Custom what's next section with step-by-step instructions
 * @returns {React.ReactElement} What's next section
 */
const WhatsNextSection = ({ confirmationNumber }) => {
  // Extract veteran name for PDF filename
  return (
    <div className="confirmation-whats-next-section">
      <h2>What you need to do next</h2>
      <p>Follow these steps to complete your application:</p>
      <va-process-list uswds>
        <va-process-list-item header="Download a PDF version of the Form you filled out.">
          <DownloadFormPDF confirmationNumber={confirmationNumber} />
        </va-process-list-item>
        <va-process-list-item header="Have an examiner complete the remaining sections.">
          <p>
            The examiner must be a Medical Doctor (MD) or Doctor of Osteopathic
            (DO) medicine, physician assistant or advanced practice registered
            nurse.
          </p>
        </va-process-list-item>

        <va-process-list-item header="Once the examiner has completed their part of the form and signed it, they'll return it to you." />

        <va-process-list-item header="Upload your fully completed form.">
          <p>
            <va-link-action
              href="/forms/upload/21-2680/introduction"
              text="Upload your completed VA form 21-2680"
            />
          </p>
        </va-process-list-item>
      </va-process-list>
    </div>
  );
};

WhatsNextSection.propTypes = {
  confirmationNumber: PropTypes.string,
};

/**
 * Confirmation page component for VA Form 21-2680
 * Displays submission confirmation details and next steps
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} [props.form] - Form state object from Redux
 * @param {Object} [props.form.data] - Form data
 * @param {string} [props.form.formId] - Unique form identifier
 * @param {Object} [props.form.submission] - Submission details
 * @param {string} [props.form.submission.timestamp] - Submission timestamp
 * @param {string} [props.name] - Applicant name
 * @param {Object} props.route - Route configuration
 * @param {Object} props.route.formConfig - Form configuration object
 * @returns {React.ReactElement} Confirmation page view
 */
export const ConfirmationPage = ({ route }) => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp || '';

  // Extract GUID/confirmation number (same string) from submission response
  const confirmationNumber =
    submission?.response?.attributes?.confirmationNumber || '';
  return (
    <ConfirmationView
      formConfig={route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      devOnly={{
        showButtons: true,
      }}
    >
      <CustomSubmissionAlert />
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <WhatsNextSection confirmationNumber={confirmationNumber} />
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
