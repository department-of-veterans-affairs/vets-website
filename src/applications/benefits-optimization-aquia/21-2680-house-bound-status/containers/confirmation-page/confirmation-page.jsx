/**
 * @module containers/ConfirmationPage
 * @description Confirmation page displayed after successful form submission
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { DownloadFormPDF } from '../../components/confirmation-page/DownloadFormPDF';

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

/**
 * Custom print page section
 * @returns {React.ReactElement} Print page section
 */
const PrintPageSection = () => {
  return (
    <div className="confirmation-print-this-page-section screen-only">
      <h2 className="vads-u-font-size--h4">Print this confirmation page</h2>
      <p>
        If you’d like to keep a copy of the information on this page, you can
        print it now.
      </p>
      <va-button
        text="Print this page for your records"
        onClick={() => window.print()}
      />
    </div>
  );
};

/**
 * Custom what's next section with step-by-step instructions
 * @returns {React.ReactElement} What's next section
 */
const WhatsNextSection = () => {
  return (
    <div className="confirmation-whats-next-section">
      <h2>What you need to do next</h2>
      <p>Follow these 4 steps to complete your application:</p>
      <va-process-list uswds>
        <va-process-list-item header="Download a PDF version of the form you filled out.">
          <p>
            Use the download link above to save a copy of your completed form.
          </p>
        </va-process-list-item>

        <va-process-list-item header="Send it to an examiner.">
          <p>We recommend sending it via email.</p>
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
              href="/supporting-forms-for-claims"
              text="Upload your completed VA form 21-2680"
            />
          </p>
        </va-process-list-item>
      </va-process-list>
    </div>
  );
};

/**
 * Custom contact section
 * @returns {React.ReactElement} Contact section
 */
const ContactSection = () => {
  return (
    <div className="confirmation-contact-section">
      <h2>How to contact us if you have questions</h2>
      <p>
        Call us at <va-telephone contact="8008271000" /> (
        <va-telephone contact="711" tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
      <p>
        Or you can ask us a question online through Ask VA. Select the category
        and topic for the VA benefit this form is related to.
      </p>
      <p>
        <va-link
          href="https://ask.va.gov"
          text="Contact us online through Ask VA"
        />
      </p>
    </div>
  );
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

  // Extract GUID from submission response
  const guid = submission?.response?.attributes?.guid || '';
  const confirmationNumber =
    submission?.response?.attributes?.confirmationNumber || guid;

  // Extract veteran name for PDF filename
  const veteranName = form?.data?.veteranInformation?.veteranFullName || {};

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
      {guid && <DownloadFormPDF guid={guid} veteranName={veteranName} />}
      <ConfirmationView.ChapterSectionCollection />
      <PrintPageSection />
      <WhatsNextSection />
      <ContactSection />
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
