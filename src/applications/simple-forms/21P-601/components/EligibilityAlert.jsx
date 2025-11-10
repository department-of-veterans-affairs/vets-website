import React from 'react';
import PropTypes from 'prop-types';

const EligibilityAlert = ({ formData }) => {
  // Check for disqualifying conditions
  if (formData.hasAlreadyFiled === true) {
    return (
      <va-alert status="error" role="alert" uswds>
        <h3 slot="headline">You don’t need to complete this form</h3>
        <div>
          <p>
            You’ve indicated that you already filed for survivor benefits using
            Form 21P-534EZ or 21P-535. Your accrued benefits claim is already
            included in that application.
          </p>
          <p>
            <strong>What to do next:</strong> Check the status of your existing
            claim instead of filing this form.
          </p>
        </div>
      </va-alert>
    );
  }

  if (formData.needsWitnessSignature === true) {
    return (
      <va-alert status="error" role="alert" uswds>
        <h3 slot="headline">Unable to submit online</h3>
        <div>
          <p>
            You’ve indicated you need to sign with an X mark, which requires two
            witnesses. This option is not currently available for online
            submission.
          </p>
          <p>
            <strong>What to do next:</strong>
          </p>
          <ol>
            <li>Download the paper form</li>
            <li>Complete it with your mark</li>
            <li>Have two witnesses sign</li>
            <li>Mail the completed form to VA</li>
          </ol>
          <p>
            <a
              href="https://www.va.gov/find-forms/about-form-21p-601/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download VA Form 21P-601 (PDF)
            </a>
          </p>
        </div>
      </va-alert>
    );
  }

  if (formData.hasUnpaidCreditors === true) {
    return (
      <va-alert status="error" role="alert" uswds>
        <h3 slot="headline">Third-party signatures required</h3>
        <div>
          <p>
            Your application requires signatures from unpaid creditors who must
            waive their rights to reimbursement. This cannot be completed online
            at this time.
          </p>
          <p>
            <strong>What to do next:</strong>
          </p>
          <ol>
            <li>Download the paper form</li>
            <li>Complete your sections</li>
            <li>Have each unpaid creditor complete and sign Section IV</li>
            <li>Mail the completed form with all signatures to VA</li>
          </ol>
          <p>
            <va-link
              external
              href="https://www.va.gov/find-forms/about-form-21p-601/"
              rel="noopener noreferrer"
              text="Download VA Form 21P-601 (PDF)"
            />
          </p>
        </div>
      </va-alert>
    );
  }

  // If all checks pass, show success message
  return (
    <va-alert status="success" uswds>
      <h3 slot="headline">You can continue with this online form</h3>
      <p>
        Based on your answers, you’re eligible to submit this form online.
        Please continue to provide information about the veteran and
        beneficiary.
      </p>
    </va-alert>
  );
};

EligibilityAlert.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default EligibilityAlert;
