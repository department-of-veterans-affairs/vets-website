/**
 * @module containers/ConfirmationPage
 * @description Confirmation page displayed after successful form submission
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { formatDateLong } from 'platform/utilities/date';
import { ConfirmationView } from 'platform/forms-system/src/js/components/ConfirmationView';
import { transformForSubmit } from '@bio-aquia/21-4192-employment-information/config/submit-transformer';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import DownloadFormPDF from './download-form-pdf';

/**
 * Confirmation page component for VA Form 21-4192
 * Displays submission confirmation details and next steps
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.route - Route configuration
 * @param {Object} props.route.formConfig - Form configuration object
 * @returns {React.ReactElement} Confirmation page view
 */
export const ConfirmationPage = ({ route }) => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const { formConfig } = route || {};
  const transformedData = transformForSubmit(formConfig, form);

  const submitDate = submission?.timestamp || '';
  const formattedSubmitDate = submitDate ? formatDateLong(submitDate) : '';
  const confirmationNumber = submission?.response?.confirmationNumber || '';
  const ConfirmationHowToContact = () => (
    <>
      <p>
        For assistance or to ask questions about your claim status please call
        the Veterans Benefits Administration National Call Center at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone tty="true" contact={CONTACTS[711]} />) We’re here Monday
        through Friday, 8:00 a.m. to 9:00 p.m. ET.
      </p>
      <p>
        Or you can ask us a question online through Ask VA. Select the category
        and topic for the VA benefit this form is related to.
      </p>
      <p>
        <va-link
          href="https://ask.va.gov/"
          text="Contact us online through Ask VA"
        />
      </p>
    </>
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
        title={`You’ve provided information in connection a with a Veteran’s claim for disability benefits${
          formattedSubmitDate ? ` on ${formattedSubmitDate}.` : '.'
        }`}
        content={null}
        actions={<p />}
      />
      <div className="confirmation-save-pdf-download-section">
        <h2>Save a copy of your form</h2>
        <p>
          If you’d like a PDF copy of your completed form, you can download it.{' '}
        </p>
        <DownloadFormPDF formData={transformedData} />
      </div>
      <ConfirmationView.ChapterSectionCollection />
      <ConfirmationView.PrintThisPage />
      <ConfirmationView.WhatsNextProcessList
        item1Header="We’ll review your form"
        item1Content="If we need more information after reviewing your form, we’ll contact you."
        item1Actions={<p />}
        item2Header="We’ll send the Veteran a decision on their claim"
        item2Content="We’ll use the information you provided in our decision."
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
          Evidence Intake Center <br />
          P.O. Box 4444 <br />
          Janesville, WI 53547-4444 <br />
        </p>
        <p>
          <strong>Note:</strong> Mail us copies of your documents only. Don’t
          send us your original documents. We can’t return them.
        </p>
      </div>
      <ConfirmationView.HowToContact content={ConfirmationHowToContact()} />
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
