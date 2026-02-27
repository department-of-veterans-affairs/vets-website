import React, { useState } from 'react';
import {
  VaCheckboxGroup,
  VaCheckbox,
  VaPrivacyAgreement,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getApplicantName, getRepresentativeName } from '../utilities/helpers';

export const PreSubmitInfo = ({
  formData,
  showError,
  onSectionComplete,
  formSubmission,
}) => {
  const hasSubmit = !!formSubmission.status;
  const isSubmitPending = formSubmission.status === 'submitPending';
  const [termsAndConditionsChecked, setTermsAndConditionsChecked] = useState(
    false,
  );
  const [formReplacementChecked, setFormReplacementChecked] = useState(false);
  const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);

  // Derive error states directly from props and checked state.
  // Avoids an extra render cycle from useEffect + setState, which caused
  // flaky test failures under Node 22's faster scheduler timing.
  const termsAndConditionsError =
    showError && !hasSubmit && !termsAndConditionsChecked;
  const formReplacementError =
    showError && !hasSubmit && !formReplacementChecked;
  const privacyPolicyError = showError && !hasSubmit && !privacyPolicyChecked;

  const applicantFullName = getApplicantName(formData);

  // Returns org for orgs and VSO reps, otherwise full name of attorney/claims agent
  const representativeName = getRepresentativeName(formData);

  // Notify the parent of section completion synchronously from the change
  // handlers. Avoids a useEffect which would schedule the callback
  // asynchronously, causing flaky tests under Node 22's scheduler timing.
  const handleTermsAndConditionsChange = value => {
    const { checked } = value.detail;
    setTermsAndConditionsChecked(checked);
    onSectionComplete(
      checked && formReplacementChecked && privacyPolicyChecked,
    );
  };

  const handleFormReplacementChange = value => {
    const { checked } = value.detail;
    setFormReplacementChecked(checked);
    onSectionComplete(
      termsAndConditionsChecked && checked && privacyPolicyChecked,
    );
  };

  const handlePrivacyPolicyChange = value => {
    const { checked } = value.detail;
    setPrivacyPolicyChecked(checked);
    onSectionComplete(
      termsAndConditionsChecked && formReplacementChecked && checked,
    );
  };

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
          <p>
            I, the claimant {applicantFullName} hereby appoint{' '}
            {representativeName} as my representative to prepare, present and
            prosecute my claim for any and all benefits from the Department of
            Veterans Affairs (VA) based on the service of the veteran named.{' '}
          </p>{' '}
          <p>
            I authorize the Department of Veterans Affairs to release any and
            all of my records, to include disclosure of my Federal tax
            information (other than the items identified in the permission
            sections), to that service organization appointed as my
            representative. It is understood that no fee or compensation of
            whatsoever nature will be charged me for service rendered pursuant
            to this power of attorney.
          </p>
          <p>
            I understand that the service organization I have appointed as my
            representative may revoke this power of attorney at any time,
            subject to 38 CFR 20.608. Additionally, in those cases where a
            Veteran’s income is being developed because of an income
            verification necessitated by an Internal Revenue Service
            verification match, the assignment of the service organization as
            the Veteran’s representative is only valid for five years from the
            date this form is signed for purposes restricted to the verification
            match. Signed and accepted subject to the foregoing conditions.
          </p>
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
            onVaChange={handleTermsAndConditionsChange}
            error={termsAndConditionsError ? 'This field is mandatory' : null}
            data-testid="terms-and-conditions"
          />
          <VaCheckbox
            label="I accept that this form will replace all my other VA Forms 21-22 and 21-22a"
            name="I accept that this form will replace all my other VA Forms 21-22 and 21-22a"
            required
            aria-describedby="accept-form-replacement"
            checked={formReplacementChecked}
            onVaChange={handleFormReplacementChange}
            error={formReplacementError ? 'This field is mandatory' : null}
            data-testid="form-replacement"
          />
          <div className="vads-u-margin-top--3">
            <VaPrivacyAgreement
              enable-analytics
              onVaChange={handlePrivacyPolicyChange}
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
