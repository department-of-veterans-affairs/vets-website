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
 * Submission alert for multi-party flow
 * @param {Object} props
 * @param {string} props.examinerEmail - The medical professional's email address
 * @returns {React.ReactElement} Success alert component
 */
const MultiPartySubmissionAlert = ({ examinerEmail }) => {
  return (
    <va-alert
      uswds
      status="success"
      className="confirmation-submission-alert-section vads-u-margin-bottom--4"
    >
      <h2 slot="headline" tabIndex="-1">
        We’ve notified the medical professional
      </h2>
      <p>
        We sent an email to <strong>{examinerEmail}</strong> with a link to
        complete the medical examination portion of this form (Sections
        VI&ndash;VIII).
      </p>
    </va-alert>
  );
};

MultiPartySubmissionAlert.propTypes = {
  examinerEmail: PropTypes.string,
};

/**
 * Submission alert for legacy single-party flow
 * @returns {React.ReactElement} Warning alert component
 */
const LegacySubmissionAlert = () => {
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
 * What's next section for the multi-party flow
 * Explains the automated examiner notification process
 * @param {Object} props
 * @param {string} props.examinerEmail - The medical professional's email
 * @param {string} props.confirmationNumber - Submission confirmation number
 * @returns {React.ReactElement} What's next section
 */
const WhatsNextSection = ({ examinerEmail, confirmationNumber }) => {
  return (
    <div className="confirmation-whats-next-section">
      <h2>What happens next</h2>
      <va-process-list uswds>
        <va-process-list-item header="We sent an email to the medical professional">
          <p>
            We sent an email to <strong>{examinerEmail}</strong> with a secure
            link to complete the examination portion of this form.
          </p>
        </va-process-list-item>
        <va-process-list-item header="The medical professional completes their sections">
          <p>
            The examiner must be a Medical Doctor (MD) or Doctor of Osteopathic
            (DO) medicine, physician assistant, or advanced practice registered
            nurse. They will complete and sign Sections VI&ndash;VIII.
          </p>
        </va-process-list-item>
        <va-process-list-item header="We'll notify you when it's complete">
          <p>
            Once the medical professional submits their portion, we’ll send you
            an email notification. Your completed application will then be
            submitted for processing.
          </p>
        </va-process-list-item>
      </va-process-list>
      <DownloadFormPDF confirmationNumber={confirmationNumber} />
    </div>
  );
};

WhatsNextSection.propTypes = {
  confirmationNumber: PropTypes.string,
  examinerEmail: PropTypes.string,
};

/**
 * Legacy what's next section for the single-party flow
 * Instructs the user to download, have examiner complete, and upload
 * @param {Object} props
 * @param {string} props.confirmationNumber - Submission confirmation number
 * @returns {React.ReactElement} What's next section
 */
const LegacyWhatsNextSection = ({ confirmationNumber }) => {
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

LegacyWhatsNextSection.propTypes = {
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

  // Extract GUID/confirmation number from submission response
  const confirmationNumber =
    submission?.response?.attributes?.confirmationNumber || '';

  // Extract examiner email from form data to determine which flow was used.
  // If examiner email exists, the multi-party flow was used.
  const examinerEmail = form?.data?.examinerNotification?.examinerEmail || '';
  const isMultiParty = Boolean(examinerEmail);

  return (
    <ConfirmationView
      formConfig={route?.formConfig}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      devOnly={{
        showButtons: true,
      }}
    >
      {isMultiParty ? (
        <MultiPartySubmissionAlert examinerEmail={examinerEmail} />
      ) : (
        <LegacySubmissionAlert />
      )}
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      {isMultiParty ? (
        <WhatsNextSection
          examinerEmail={examinerEmail}
          confirmationNumber={confirmationNumber}
        />
      ) : (
        <LegacyWhatsNextSection confirmationNumber={confirmationNumber} />
      )}
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
