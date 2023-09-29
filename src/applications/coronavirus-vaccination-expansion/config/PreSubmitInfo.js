import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const PreSubmitCheckboxes = ({ showError, onSectionComplete }) => {
  const [privacyAgreementAccepted, setPrivacyAgreementAccepted] = useState(
    false,
  );
  const [
    truthfullnessAgreementAccepted,
    setTruthfullnessAgreementAccepted,
  ] = useState(false);
  const [truthfullnessError, setTruthfullnessError] = useState(false);
  const truthfulnessErrorMessage = truthfullnessError
    ? 'You must certify that your submission is truthful before submitting'
    : null;

  const [privacyError, setPrivacyError] = useState(false);
  const privacyErrorMessage = privacyError
    ? "You must certify that you have access to VA's privacy practice information before submitting"
    : null;

  useEffect(
    () => {
      setPrivacyError(showError && !privacyAgreementAccepted);
      setTruthfullnessError(showError && !truthfullnessAgreementAccepted);
      onSectionComplete(
        privacyAgreementAccepted && truthfullnessAgreementAccepted,
      );
    },
    [privacyAgreementAccepted, truthfullnessAgreementAccepted, showError],
  );

  return (
    <>
      <VaCheckbox
        id="privacy-practices-checkbox"
        checked={privacyAgreementAccepted}
        onVaChange={event => setPrivacyAgreementAccepted(event.detail.checked)}
        label="I have been provided access to VA's Notice of Privacy Practices."
        error={privacyErrorMessage}
        required
      >
        <span slot="description">
          <a
            id="kif-privacy-policy"
            target="_blank"
            rel="noreferrer"
            href="https://www.va.gov/files/2022-10/10-163p_(004)_-Notices_of_Privacy_Practices-_PRINT_ONLY.pdf"
          >
            VA’s Notice of Privacy Practices.
          </a>
        </span>
      </VaCheckbox>{' '}
      <VaCheckbox
        id="truthfulness-checkbox"
        class="vads-u-margin-top--3"
        checked={truthfullnessAgreementAccepted}
        onVaChange={event =>
          setTruthfullnessAgreementAccepted(event.detail.checked)
        }
        label="I certify that the information I’ve provided in this form is true and
      correct to the best of my knowledge and belief. I understand that it's a
      crime to provide information that I know is untrue or incorrect. I
      understand that doing so could result in a fine or other penalty. I have
      also read and accept the privacy policy."
        error={truthfulnessErrorMessage}
        required
      >
        <span slot="description">
          <a target="_blank" href="/privacy-policy/">
            VA.gov Privacy Policy
          </a>
        </span>
      </VaCheckbox>
    </>
  );
};
const mapStateToProps = state => {
  return {
    formSubmission: state.form.submission,
  };
};

export default {
  required: true,
  CustomComponent: connect(
    mapStateToProps,
    null,
  )(PreSubmitCheckboxes),
};
