import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

const PreSubmitCheckboxes = ({ showError, onSectionComplete }) => {
  const [privacyAgreementAccepted, setPrivacyAgreementAccepted] = useState(
    false,
  );
  const [
    truthfullnessAgreementAccepted,
    setTruthfullnessAgreementAccepted,
  ] = useState(false);
  const truthfulnessLabel = (
    <span>
      {' '}
      I certify that the information I’ve provided in this form is true and
      correct to the best of my knowledge and belief. I understand that it's a
      crime to provide information that I know is untrue or incorrect. I
      understand that doing so could result in a fine or other penalty. I have
      also read and accept the{' '}
      <a target="_blank" href="/privacy-policy/">
        privacy policy.
      </a>
    </span>
  );
  const truthfulnessErrorMessage =
    'You must certify that your submission is truthful before submitting';
  const [truthfullnessError, setTruthfullnessError] = useState(false);

  const privacyLabel = (
    <span>
      I have been provided access to{' '}
      <a
        id="kif-privacy-policy"
        target="_blank"
        rel="noreferrer"
        href="https://www.va.gov/vhapublications/ViewPublication.asp?pub_ID=1090"
      >
        VA's Notice of Privacy Practices.
      </a>{' '}
    </span>
  );
  const privacyErrorMessage =
    "You must certify that you have access to VA's privacy practice information before submitting";
  const [privacyError, setPrivacyError] = useState(false);

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
      <Checkbox
        checked={privacyAgreementAccepted}
        onValueChange={value => setPrivacyAgreementAccepted(value)}
        label={privacyLabel}
        errorMessage={privacyError && privacyErrorMessage}
        required
      />
      <Checkbox
        checked={truthfullnessAgreementAccepted}
        onValueChange={value => setTruthfullnessAgreementAccepted(value)}
        label={truthfulnessLabel}
        errorMessage={truthfullnessError && truthfulnessErrorMessage}
        required
      />
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
