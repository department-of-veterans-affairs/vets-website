import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

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
  const [hasError, setError] = useState(false);
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
        setError(true);
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
        setError(false);
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
    ],
  );

  return (
    <TextInput
      ariaDescribedBy={ariaDescribedBy}
      additionalClass="signature-input"
      label={createInputLabel(label)}
      required={required}
      onValueChange={signatureValue => setSignature(signatureValue)}
      field={{ value: signature.value, dirty: signature.dirty }}
      errorMessage={hasError && errorMessage}
    />
  );
};

SignatureInput.propTypes = {
  fullName: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  showError: PropTypes.bool.isRequired,
  hasSubmittedForm: PropTypes.bool.isRequired,
  setSignatures: PropTypes.func.isRequired,
  isRepresentative: PropTypes.bool,
  ariaDescribedBy: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

export default SignatureInput;
