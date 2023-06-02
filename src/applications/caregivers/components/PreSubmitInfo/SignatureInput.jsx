import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const SignatureInput = props => {
  const {
    fullName,
    required,
    label,
    showError,
    hasSubmittedForm,
    isRepresentative,
    setSignatures,
    isChecked,
    ariaDescribedBy,
  } = props;

  const [error, setError] = useState();
  const [signature, setSignature] = useState({
    value: '',
    dirty: false,
  });

  // set label and error message strings
  const textInputLabel = isRepresentative
    ? `Enter your name to sign as the Veteran\u2019s representative`
    : `${label} full name`;

  const errorMessage = isRepresentative
    ? 'You must sign as representative.'
    : `Your signature must match previously entered name: ${fullName}`;

  /*
   * validate input string against the desired value
   *
   * normalizedSignature: the current state value with extra whitespaces trimmed
   * signatureMatches: compare the normalizedSignature string again the desired value
   * isSignatureComplete: complete if the value & desired string match and the parent checkbox is checked
   */
  const normalizedSignature = signature.value.replace(/ +(?= )/g, '');

  const signatureMatches =
    normalizedSignature.toLocaleLowerCase() === fullName.toLocaleLowerCase();

  const isSignatureComplete = signatureMatches && isChecked;

  // set blur event for the input
  const onBlur = useCallback(
    event => {
      setSignature({ value: event.target.value, dirty: true });
    },
    [setSignature],
  );

  // set signature value if all checks pass
  useEffect(
    () => {
      if (!isSignatureComplete) return;

      setSignatures(prevState => {
        return { ...prevState, [label]: signature.value };
      });
    },

    [isSignatureComplete, label, setSignatures, signature.value],
  );

  // validate input on dirty/value change
  useEffect(
    () => {
      const isDirty = signature.dirty;

      /* 
       * show error if the user has touched input and the value does not match OR 
       * if there is a form error and the form has not been submitted
       */
      if ((isDirty && !signatureMatches) || (showError && !hasSubmittedForm)) {
        setSignatures(prevState => {
          return { ...prevState, [label]: '' };
        });
        setError(errorMessage);
      }

      /* 
       * allow submission if we need to validate the input and the value matches the 
       * desired string OR if the user is a filling out as a third party and no string 
       * validation is necessary
       */
      if (
        (isDirty && signatureMatches) ||
        (isDirty && isRepresentative && !!normalizedSignature)
      ) {
        setSignatures(prevState => {
          return { ...prevState, [label]: signature.value };
        });
        setError();
      }
    },
    [
      signatureMatches,
      showError,
      hasSubmittedForm,
      isRepresentative,
      normalizedSignature,
      signature,
      setSignatures,
      label,
      errorMessage,
    ],
  );

  return (
    <VaTextInput
      messageAriaDescribedby={ariaDescribedBy}
      class="signature-input"
      label={textInputLabel}
      required={required}
      value={signature.value}
      error={error}
      onBlur={onBlur}
    />
  );
};

SignatureInput.propTypes = {
  fullName: PropTypes.string.isRequired,
  hasSubmittedForm: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  setSignatures: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  ariaDescribedBy: PropTypes.string,
  isChecked: PropTypes.bool,
  isRepresentative: PropTypes.bool,
  required: PropTypes.bool,
};

export default SignatureInput;
