/**
 * @module containers/ConfirmationPage
 * @description Confirmation page displayed after successful form submission
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';

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
export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp;
  const confirmationNumber =
    submission?.response?.confirmationNumber ||
    '0dc34cd0-1aa1-1111-11a111a1a11a';
  const data = form?.data || {};

  // Format the submission date with error handling
  let formattedDate;
  let alertDate;

  try {
    if (submitDate) {
      const parsedDate =
        typeof submitDate === 'string'
          ? parseISO(submitDate)
          : new Date(submitDate);
      formattedDate = format(parsedDate, 'MMM. dd, yyyy h:mm a zzz');
      alertDate = format(parsedDate, 'MMMM dd, yyyy');
    } else {
      const now = new Date();
      formattedDate = format(now, 'MMM. dd, yyyy h:mm a zzz');
      alertDate = format(now, 'MMMM dd, yyyy');
    }
  } catch (error) {
    // Fallback to current date if date parsing fails
    const now = new Date();
    formattedDate = format(now, 'MMM. dd, yyyy h:mm a zzz');
    alertDate = format(now, 'MMMM dd, yyyy');
  }

  // Get organization name or veteran name
  const submitterName =
    data?.veteranInformation?.firstName || data?.veteranInformation?.lastName
      ? `${data.veteranInformation.firstName || ''} ${data.veteranInformation
          .lastName || ''}`.trim()
      : '[Organization title]';

  return (
    <>
      <va-alert status="success" uswds>
        <h2 slot="headline">
          You’ve submitted your application for a burial allowance on{' '}
          {alertDate}
        </h2>
        <p className="vads-u-margin-y--0">
          After we receive your application, we’ll review your information and
          send you a letter with more information about your claim.
        </p>
      </va-alert>

      <div className="usa-alert usa-alert-info background-color-only vads-u-margin-top--3 vads-u-padding--3">
        <h2 className="vads-u-margin-top--0">Your submission information</h2>

        <h3 className="vads-u-font-size--h4">Who submitted this form</h3>
        <p>{submitterName}</p>

        <h3 className="vads-u-font-size--h4">Confirmation number</h3>
        <p>{confirmationNumber}</p>

        <h3 className="vads-u-font-size--h4">Date submitted</h3>
        <p>{formattedDate}</p>

        <h3 className="vads-u-font-size--h4">Deceased Veteran</h3>
        <p>
          {data?.veteranInformation?.firstName ||
          data?.veteranInformation?.lastName
            ? `${data.veteranInformation.firstName || ''} ${data
                .veteranInformation.lastName || ''}`.trim()
            : 'James Smith'}
        </p>

        <h3 className="vads-u-font-size--h4">Your application was sent to</h3>
        <p className="vads-u-margin-bottom--0">
          Department of Veterans Affairs Pension Claims Intake Center
          <br />
          P.O. Box 5365
          <br />
          Janesville, WI 53547-5365
        </p>

        <h3 className="vads-u-font-size--h4 vads-u-margin-top--3">
          Confirmation for your records
        </h3>
        <p>You can print this confirmation page for your records</p>

        <va-button text="Print this page" onClick={() => window.print()} />
      </div>

      <h2 className="vads-u-margin-top--4">
        How to submit supporting documents
      </h2>
      <p>
        If you still need to submit additional supporting documents, you can
        submit them by mail.
      </p>
      <p>
        Write the Veteran’s Social Security number or VA file number (if it’s
        different than their Social Security number) on the first page of the
        documents.
      </p>
      <p>Mail any supporting documents to this address:</p>

      <div className="vads-u-border-left--5px vads-u-border-color--primary vads-u-padding-left--2 vads-u-margin-y--2">
        <p className="vads-u-margin-y--0">
          Department of Veterans Affairs
          <br />
          Pension Claims Intake Center
          <br />
          PO Box 5365
          <br />
          Janesville, WI 53547-5365
        </p>
      </div>

      <p>
        <strong>Note:</strong> Mail us copies of your documents only. Don’t send
        us your original documents. We can’t return them.
      </p>

      <h2 className="vads-u-margin-top--4">What are my next steps?</h2>
      <p>
        We’ll review your claim. If we have more questions or need more
        information, we’ll contact you by phone, email, or mail. Then we’ll send
        you a letter with our decision.
      </p>

      <h2 className="vads-u-margin-top--4">
        How can I check the status of my claim?
      </h2>
      <p>[TBD]</p>
    </>
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
