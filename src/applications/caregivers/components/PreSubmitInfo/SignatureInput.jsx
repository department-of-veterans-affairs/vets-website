import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const SignatureInput = ({
  fullName,
  required,
  label,
  showError,
  hasSubmittedForm,
  isRepresentative,
  setSignatures,
  isChecked,
  ariaDescribedBy,
}) => {
  const [error, setError] = useState();
  const firstName = fullName.first || '';
  const lastName = fullName.last || '';
  const middleName = fullName.middle || '';

  const [signature, setSignature] = useState({
    value: '',
    dirty: false,
  });

  const createInputLabel = inputLabel =>
    isRepresentative
      ? `Enter your name to sign as the Veteran\u2019s representative`
      : `${inputLabel} full name`;

  const firstLetterOfMiddleName =
    middleName === undefined ? '' : middleName.charAt(0);

  const removeSpaces = string =>
    string
      .split(' ')
      .join('')
      .toLocaleLowerCase();

  const getName = (middle = '') =>
    removeSpaces(
      `${firstName?.toLowerCase()}${middle?.toLowerCase()}${lastName?.toLowerCase()}`,
    );

  const errorMessage = isRepresentative
    ? 'You must sign as representative.'
    : `Your signature must match previously entered name: ${firstName} ${middleName} ${lastName}`;

  const normalizedSignature = removeSpaces(signature.value);

  // first and last
  const firstAndLastMatches = getName() === normalizedSignature;

  // middle initial
  const middleInitialMatches =
    getName(firstLetterOfMiddleName) === normalizedSignature;

  // middle name
  const withMiddleNameMatches = getName(middleName) === normalizedSignature;

  const signatureMatches =
    firstAndLastMatches || middleInitialMatches || withMiddleNameMatches;

  const isSignatureComplete = signatureMatches && isChecked;

  const onBlur = useCallback(
    event => {
      setSignature({ value: event.target.value, dirty: true });
    },
    [setSignature],
  );

  useEffect(
    () => {
      if (!isSignatureComplete) return;

      setSignatures(prevState => {
        return { ...prevState, [label]: signature.value };
      });
    },

    [isSignatureComplete, label, setSignatures, signature.value],
  );

  useEffect(
    () => {
      const isDirty = signature.dirty;

      /* show error if user has touched input and signature does not match
         show error if there is a form error and has not been submitted */
      if ((isDirty && !signatureMatches) || (showError && !hasSubmittedForm)) {
        setSignatures(prevState => {
          return { ...prevState, [label]: '' };
        });
        setError(errorMessage);
      }

      /* if input has been touched and signature matches allow submission
         if input is dirty and representative is signing skip validation and make sure signature is present
         all signature matching logic is with spaces removed
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
      aria-describedby={ariaDescribedBy}
      class="signature-input"
      label={createInputLabel(label)}
      required={required}
      value={signature.value}
      error={error}
      onBlur={onBlur}
    />
  );
};

SignatureInput.propTypes = {
  fullName: PropTypes.object.isRequired,
  hasSubmittedForm: PropTypes.bool.isRequired,
  isChecked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  setSignatures: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  ariaDescribedBy: PropTypes.string,
  isRepresentative: PropTypes.bool,
  required: PropTypes.bool,
};

export default SignatureInput;
