import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { replaceStrValues } from '../../utils';

const SignatureInput = props => {
  const {
    fullName,
    hasSubmittedForm,
    required,
    setIsStatementOfTruthSigned,
    showError,
  } = props;

  const [signatureMatches, setSignatureMatches] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    value: '',
    dirty: false,
  });

  const errorMessage = replaceStrValues(
    'Your signature must match previously entered name: %s',
    fullName,
  );

  const normalizeSignature = value => {
    return value.replace(/ +(?= )/g, '');
  };

  const handleBlur = useCallback(
    event => {
      const { value } = event.target;
      setData({ value, dirty: true });
    },
    [setData],
  );

  const handleChange = event => {
    const { value } = event.target;
    setData({ value, dirty: data.dirty });
  };

  const normalizedSignature = useMemo(() => normalizeSignature(data.value), [
    data.value,
  ]);

  const isMatch = useMemo(
    () =>
      normalizedSignature.toLocaleLowerCase() === fullName.toLocaleLowerCase(),
    [normalizedSignature, fullName],
  );

  useEffect(
    () => {
      setSignatureMatches(isMatch);
      setIsStatementOfTruthSigned(isMatch);
    },
    [isMatch, setSignatureMatches, setIsStatementOfTruthSigned],
  );

  useEffect(
    () => {
      const isDirty = data.dirty;
      /*
       * show error if the user has touched input and the value does not match OR
       * if there is a form error and the form has not been submitted
       */
      if ((isDirty && !signatureMatches) || (showError && !hasSubmittedForm)) {
        setError(errorMessage);
      }

      if (isDirty && signatureMatches) {
        setError(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, errorMessage, hasSubmittedForm, signatureMatches, showError],
  );

  return (
    <VaTextInput
      class="signature-input"
      label="Your full name"
      required={required}
      value={data.value}
      error={error}
      onBlur={handleBlur}
      onInput={handleChange}
    />
  );
};

SignatureInput.propTypes = {
  fullName: PropTypes.string.isRequired,
  hasSubmittedForm: PropTypes.bool.isRequired,
  setIsStatementOfTruthSigned: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  required: PropTypes.bool,
};

export default SignatureInput;
