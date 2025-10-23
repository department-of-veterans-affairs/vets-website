/**
 * @module containers/ConfirmationPage
 * @description Confirmation page component for VA Form 21P-530A that displays
 * submission confirmation details and next steps
 */

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

import { SUBMISSION_ADDRESS } from '@bio-aquia/21p-530a-interment-allowance/constants';

/**
 * Confirmation page displayed after successful form submission
 * @param {Object} props - Component properties
 * @param {Object} props.route - Route configuration from react-router
 * @param {Object} props.route.formConfig - Form configuration object
 * @returns {React.ReactElement} Confirmation page component
 */
export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const formData = form?.data || {};
  const submission = form?.submission || {};
  const submitDate = submission?.timestamp;
  const confirmationNumber = submission?.response?.confirmationNumber || '';

  useEffect(() => {
    scrollToTop();
    focusElement('h2');
  }, []);

  const formatSubmitDate = () => {
    if (!submitDate) return '';
    try {
      const date = new Date(submitDate);
      return format(date, 'MMMM dd, yyyy');
    } catch (error) {
      return '';
    }
  };

  const formatSubmitDateTime = () => {
    if (!submitDate) return '';
    try {
      const date = new Date(submitDate);
      return format(date, "MMM. dd, yyyy h:mm a 'EST'");
    } catch (error) {
      return '';
    }
  };

  const printPage = () => {
    window.print();
  };

  const organizationTitle =
    formData?.organizationTitle || '[Organization title]';
  const veteranFullName = formData?.veteranIdentification?.fullName
    ? `${formData.veteranIdentification.fullName.first} ${
        formData.veteranIdentification.fullName.last
      }`
    : 'Deceased Veteran';

  return (
    <div className="confirmation-page">
      <va-alert status="success" uswds>
        <h2 slot="headline">
          You’ve submitted your application for a burial allowance on{' '}
          {formatSubmitDate()}
        </h2>
        <p>
          After we receive your application, we’ll review your information and
          send you a letter with more information about your claim.
        </p>
      </va-alert>

      <div className="inset vads-u-margin-top--4">
        <h3 className="vads-u-margin-top--0">Your submission information</h3>

        <h4>Who submitted this form</h4>
        <p>{organizationTitle}</p>

        <h4>Confirmation number</h4>
        <p>{confirmationNumber}</p>

        <h4>Date submitted</h4>
        <p>{formatSubmitDateTime()}</p>

        <h4>Deceased Veteran</h4>
        <p>{veteranFullName}</p>

        <h4>Your application was sent to</h4>
        <p className="va-address-block">
          {SUBMISSION_ADDRESS.name}
          <br />
          {SUBMISSION_ADDRESS.street}
          <br />
          {SUBMISSION_ADDRESS.city}, {SUBMISSION_ADDRESS.state}{' '}
          {SUBMISSION_ADDRESS.zip}
        </p>

        <h4>Confirmation for your records</h4>
        <p>You can print this confirmation page for your records</p>

        <va-button text="Print this page" onClick={printPage} secondary />
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
      <div className="vads-u-margin-left--2 vads-u-border-left--5px vads-u-border-color--primary vads-u-padding-left--2">
        <p className="va-address-block">
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

      <h2>What are my next steps?</h2>
      <p>
        We’ll review your claim. If we have more questions or need more
        information, we’ll contact you by phone, email, or mail. Then we’ll send
        you a letter with our decision.
      </p>

      <h2>How can I check the status of my claim?</h2>
      <p>[TBD]</p>

      <p className="vads-u-margin-top--4">
        <va-link href="https://www.va.gov" text="Go back to VA.gov" />
      </p>
    </div>
  );
};
