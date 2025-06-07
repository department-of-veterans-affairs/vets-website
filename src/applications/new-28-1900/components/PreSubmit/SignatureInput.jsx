import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { replaceStrValues } from '../../utils/helpers';

const SignatureInput = props => {
  const {
    fullName,
    required,
    showError,
    hasSubmittedForm,
    setSignature1,
    isChecked,
    ariaDescribedBy,
  } = props;

  const [error, setError] = useState(null);
  const [data, setData] = useState({
    value: '',
    dirty: false,
  });

  const errorMessage = replaceStrValues(
    'Your signature must match previously entered name: %s',
    fullName,
  );

  /*
   * validate input string against the desired value
   *
   * normalizedSignature: the current state value with extra whitespaces trimmed
   * signatureMatches: compare the normalizedSignature string again the desired value
   * isSignatureComplete: complete if the value & desired string match and the parent checkbox is checked
   */
  const normalizedSignature = data.value.replace(/ +(?= )/g, '');
  const signatureMatches =
    normalizedSignature.toLocaleLowerCase() === fullName.toLocaleLowerCase();
  const isSignatureComplete = signatureMatches && isChecked;

  const handleChange = () => {
    setSignature1(isSignatureComplete);
  };

  const handleBlur = useCallback(
    event => {
      setData({ value: event.target.value, dirty: true });
    },
    [setData],
  );

  useEffect(
    () => {
      if (!isSignatureComplete) return;
      handleChange(data.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.value, isSignatureComplete],
  );

  useEffect(
    () => {
      const isDirty = data.dirty;

      /* 
       * show error if the user has touched input and the value does not match OR 
       * if there is a form error and the form has not been submitted
       */
      if ((isDirty && !signatureMatches) || (showError && !hasSubmittedForm)) {
        handleChange('');
        setError(errorMessage);
      }

      /* 
       * allow submission if we need to validate the input and the value matches the 
       * desired string OR if the user is a filling out as a third party and no string 
       * validation is necessary
       */
      if ((isDirty && signatureMatches) || (isDirty && !!normalizedSignature)) {
        handleChange(data.value);
        setError(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      data.value,
      errorMessage,
      hasSubmittedForm,
      normalizedSignature,
      showError,
      signatureMatches,
    ],
  );

  return (
    <VaTextInput
      messageAriaDescribedby={ariaDescribedBy}
      class="signature-input"
      label="Your full name"
      required={required}
      value={data.value}
      error={error}
      onBlur={handleBlur}
    />
  );
};

SignatureInput.propTypes = {
  fullName: PropTypes.string.isRequired,
  hasSubmittedForm: PropTypes.bool.isRequired,
  setSignature1: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  ariaDescribedBy: PropTypes.string,
  isChecked: PropTypes.bool,
  required: PropTypes.bool,
};

export default SignatureInput;
