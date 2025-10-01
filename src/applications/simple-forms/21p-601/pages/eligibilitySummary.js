import React from 'react';
import PropTypes from 'prop-types';

function EligibilitySummary({ formData }) {
  // Determine why they're not eligible
  let reason = '';
  let explanation = '';

  if (formData.hasAlreadyFiled === true) {
    reason = "You've already filed for survivor benefits";
    explanation =
      "Your accrued benefits claim is already included in your VA Form 21P-534EZ or 21P-535 application. You don't need to file this form separately.";
  } else if (formData.needsWitnessSignature === false) {
    reason = 'You need witness signatures';
    explanation =
      "Since you can't sign your full name, you'll need to sign with an X mark and have 2 witnesses also sign the form. This can't be done online.";
  } else if (formData.hasUnpaidCreditors === true) {
    reason = 'You have unpaid creditors';
    explanation =
      "Your unpaid creditors must sign waivers on the form. This requires their original signatures, which can't be done online.";
  }

  // If they're eligible (shouldn't reach this page due to form config)
  if (
    formData.hasAlreadyFiled === false &&
    formData.needsWitnessSignature === true &&
    formData.hasUnpaidCreditors === false
  ) {
    return (
      <va-alert status="error" uswds>
        <h3 slot="headline">Something went wrong</h3>
        <p>
          There was an error with the eligibility check. Please return to the
          start of the form and try again.
        </p>
      </va-alert>
    );
  }

  return (
    <>
      <va-alert status="error" uswds>
        <h3 slot="headline">You can't submit this form online</h3>
        <p>
          <strong>{reason}</strong>
        </p>
        <p>{explanation}</p>
      </va-alert>

      <div className="vads-u-margin-top--3">
        <h3>What you can do</h3>

        {formData.hasAlreadyFiled === true ? (
          <p>
            Check the status of your existing survivor benefits claim. You don't
            need to take any additional action for accrued benefits.
          </p>
        ) : (
          <>
            <p>
              You'll need to download and submit the paper version of this form.
            </p>

            <ol>
              <li>Download VA Form 21P-601</li>
              <li>Complete all required sections</li>
              {formData.needsWitnessSignature === false && (
                <li>Sign with your X mark and have 2 witnesses sign</li>
              )}
              {formData.hasUnpaidCreditors === true && (
                <li>Have your unpaid creditors complete and sign Section IV</li>
              )}
              <li>Mail the completed form to your VA regional office</li>
            </ol>

            <va-button
              className=""
              text="Download VA Form 21P-601 (PDF)"
              href="https://www.va.gov/find-forms/about-form-21p-601/"
              target="_blank"
              rel="noopener noreferrer"
            />
          </>
        )}
      </div>
    </>
  );
}

EligibilitySummary.propTypes = {
  formData: PropTypes.shape({
    hasAlreadyFiled: PropTypes.bool,
    needsWitnessSignature: PropTypes.bool,
    hasUnpaidCreditors: PropTypes.bool,
  }).isRequired,
};

export default {
  uiSchema: {
    'ui:field': EligibilitySummary,
    'ui:options': {
      hideOnReview: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
