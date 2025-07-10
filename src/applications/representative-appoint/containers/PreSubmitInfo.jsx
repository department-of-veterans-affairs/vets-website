import React, { useState, useEffect } from 'react';
import {
  VaCheckboxGroup,
  VaCheckbox,
  VaPrivacyAgreement,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export const PreSubmitInfo = ({
  _formData,
  showError,
  onSectionComplete,
  formSubmission,
}) => {
  const hasSubmit = !!formSubmission.status;
  const isSubmitPending = formSubmission.status === 'submitPending';
  const [termsAndConditionsChecked, setTermsAndConditionsChecked] = useState(
    false,
  );
  const [termsAndConditionsError, setTermsAndConditionsError] = useState(false);
  const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);
  const [privacyPolicyError, setPrivacyPolicyError] = useState(false);

  useEffect(
    () => {
      if (termsAndConditionsChecked && privacyPolicyChecked) {
        onSectionComplete(true);
      }
      return () => {
        onSectionComplete(false);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [termsAndConditionsChecked, privacyPolicyChecked],
  );

  useEffect(
    () => {
      if (showError && !hasSubmit) {
        setTermsAndConditionsError(!termsAndConditionsChecked);
        setPrivacyPolicyError(!privacyPolicyChecked);
      }
    },
    [showError, hasSubmit, termsAndConditionsChecked, privacyPolicyChecked],
  );

  if (isSubmitPending) {
    return (
      <div className="vads-u-margin-bottom--3">
        <va-loading-indicator
          label="Loading"
          message="We’re processing your form"
        />
      </div>
    );
  }

  return (
    <>
      {' '}
      <h3>Agree to the terms and conditions</h3>
      <va-accordion open-single>
        <va-accordion-item
          header="Our terms and conditions"
          id="terms-and-conditions"
        >
          <p>I, the claimant hereby ...</p> <p>I understand</p>
        </va-accordion-item>
      </va-accordion>
      <p className="vads-u-margin-top--3">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information. (See 18
        U.S.C. 1001)
      </p>
      <div className="vads-u-margin-top--neg4">
        <VaCheckboxGroup>
          {' '}
          <VaCheckbox
            required
            label="I agree to the terms and conditions"
            name="I agree to the terms and conditions"
            checked={termsAndConditionsChecked}
            aria-describedby="accept-terms-conditions"
            onVaChange={value =>
              setTermsAndConditionsChecked(value.detail.checked)
            }
            error={termsAndConditionsError ? 'This field is mandatory' : null}
            data-testid="terms-and-conditions"
          />
          <div className="vads-u-margin-top--3">
            <VaPrivacyAgreement
              enable-analytics
              onVaChange={value =>
                setPrivacyPolicyChecked(value.detail.checked)
              }
              showError={privacyPolicyError}
            />
          </div>
        </VaCheckboxGroup>
      </div>
      <p>
        <strong>Note:</strong> You can’t edit the information for your form
        after this step.
      </p>
    </>
  );
};

PreSubmitInfo.propTypes = {
  formData: PropTypes.object,
  formSubmission: PropTypes.object,
  showError: PropTypes.bool,
  onSectionComplete: PropTypes.func,
};

const mapStateToProps = ({ form }) => {
  return {
    formSubmission: form.submission,
  };
};

export default connect(
  mapStateToProps,
  null,
)(PreSubmitInfo);
