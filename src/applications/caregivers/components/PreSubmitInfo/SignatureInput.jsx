import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { replaceStrValues } from '../../utils/helpers';
import content from '../../locales/en/content.json';

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

  const [error, setError] = useState(null);
  const [data, setData] = useState({
    value: '',
    dirty: false,
  });

  // set label and error message strings
  const textInputLabel = isRepresentative
    ? content['sign-as-rep--signature-text-label']
    : replaceStrValues(content['sign-as-rep--signature-vet-text-label'], label);

  const errorMessage = isRepresentative
    ? content['validation-sign-as-rep']
    : replaceStrValues(content['validation-sign-as-rep--vet-name'], fullName);

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

  const handleChange = value => {
    setSignatures(prevState => ({ ...prevState, [label]: value }));
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
      if (
        (isDirty && signatureMatches) ||
        (isDirty && isRepresentative && !!normalizedSignature)
      ) {
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
      label={textInputLabel}
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
  label: PropTypes.string.isRequired,
  setSignatures: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  ariaDescribedBy: PropTypes.string,
  isChecked: PropTypes.bool,
  isRepresentative: PropTypes.bool,
  required: PropTypes.bool,
};

export default SignatureInput;
