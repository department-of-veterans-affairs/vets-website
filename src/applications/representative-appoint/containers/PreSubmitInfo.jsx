import React, { useState, useEffect } from 'react';
import {
  VaCheckboxGroup,
  VaCheckbox,
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
  const [termsAndConditionsError, setTermsAndConditionsError] = useState(false);
  const [formReplacementError, setFormReplacementError] = useState(false);

  const applicantFullName = getApplicantName(formData);

  // Returns org for orgs and VSO reps, otherwise full name of attorney/claims agent
  const representativeName = getRepresentativeName(formData);

  useEffect(
    () => {
      if (termsAndConditionsChecked && formReplacementChecked) {
        onSectionComplete(true);
      }
      return () => {
        onSectionComplete(false);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [termsAndConditionsChecked, formReplacementChecked],
  );

  useEffect(
    () => {
      if (showError && !hasSubmit) {
        setTermsAndConditionsError(!termsAndConditionsChecked);
        setFormReplacementError(!formReplacementChecked);
      }
    },
    [showError, hasSubmit, termsAndConditionsChecked, formReplacementChecked],
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
            enable-analytics
          />
          <VaCheckbox
            label="I accept that this form will replace all my other VA Forms 21-22 and 21-22a"
            name="I accept that this form will replace all my other VA Forms 21-22 and 21-22a"
            required
            aria-describedby="accept-form-replacement"
            checked={formReplacementChecked}
            onVaChange={value =>
              setFormReplacementChecked(value.detail.checked)
            }
            error={formReplacementError ? 'This field is mandatory' : null}
            enable-analytics
          />
        </VaCheckboxGroup>
      </div>
      <p>
        <strong>Note:</strong> After continuing to the next step, you will not
        be able to edit the information on your form.
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
