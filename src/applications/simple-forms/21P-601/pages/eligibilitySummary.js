import React from 'react';
import PropTypes from 'prop-types';

function EligibilitySummary({ formData }) {
  // Determine why they're not eligible
  let reason = '';
  let explanation = '';

  if (formData.hasAlreadyFiled === true) {
    reason = "You've already filed for survivor benefits";
    explanation =
      "Your accrued benefits claim is already included in your application for survivors benefits. You don't need to fill out this form separately.";
  } else if (formData.hasUnpaidCreditors === true) {
    reason = 'You have unpaid creditors';
    explanation =
      "Your unpaid creditors must sign waivers on the form. This requires their original signatures, which can't be done online.";
  }

  // If they're eligible (shouldn't reach this page due to form config)
  if (
    formData.hasAlreadyFiled === false &&
    formData.hasUnpaidCreditors === false
  ) {
    return (
      <>
        <h3>Eligibility results</h3>
        <va-alert status="error" role="alert" uswds>
          <h3 slot="headline">Something went wrong</h3>
          <p>
            There was an error with the eligibility check. Please return to the
            start of the form and try again.
          </p>
        </va-alert>
      </>
    );
  }

  return (
    <>
      <h3>Eligibility results</h3>
      <div className="vads-u-margin-top--3">
        <va-card background icon-name="" role="alert">
          <div>
            <h4 className="vads-u-margin-top--1">
              Based on your responses, you may not be eligible to submit this
              form online.
            </h4>
            <p>
              <strong>Your response:</strong>
            </p>
            <p>{reason}</p>
            <p>{explanation}</p>
          </div>
        </va-card>

        <h4>What you can do</h4>

        {formData.hasAlreadyFiled === true ? (
          <p>
            Check the status of your existing survivors benefits claim. You
            don't need to take any additional action for accrued benefits.
          </p>
        ) : (
          <>
            <p>
              You'll need to download and submit the paper version of this form.
            </p>

            <ol>
              <li>Download VA Form 21P-601</li>
              <li>Complete all required sections</li>
              {formData.hasUnpaidCreditors === true && (
                <li>Have your unpaid creditors complete and sign Section IV</li>
              )}
              <li>Mail the completed form to your VA regional office</li>
            </ol>

            <va-link
              external
              href="https://www.va.gov/find-forms/about-form-21p-601/"
              rel="noopener noreferrer"
              text="Download VA Form 21P-601 (PDF)"
            />
            <br />
            <br />
          </>
        )}

        <va-link-action href="/" text="Exit application" type="primary" />
      </div>
    </>
  );
}

EligibilitySummary.propTypes = {
  formData: PropTypes.shape({
    hasAlreadyFiled: PropTypes.bool,
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
