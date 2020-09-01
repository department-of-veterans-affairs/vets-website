import React, { useEffect, useState } from 'react';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';

const SignatureInput = ({
  fullName,
  required,
  label,
  setIsSigned,
  showError,
}) => {
  const [hasError, setError] = useState(false);
  const firstName = fullName.first.toLowerCase();
  const lastName = fullName.last.toLowerCase();
  const middleName = fullName.middle === undefined ? '' : fullName.middle;

  const [signature, setSignature] = useState({
    value: '',
    dirty: false,
  });

  const firstLetterOfMiddleName =
    middleName === undefined ? '' : middleName.charAt(0);

  const getName = (middle = '') =>
    `${firstName}${middle}${lastName}`
      .split(' ')
      .join('')
      .toLocaleLowerCase();

  const normalizedSignature = signature.value
    .split(' ')
    .join('')
    .toLocaleLowerCase();

  // first and last
  const firstAndLastMatches = getName() === normalizedSignature;

  // middle initial
  const middleInitialMatches =
    getName(firstLetterOfMiddleName) === normalizedSignature;

  // middle name
  const withMiddleNameMatches = getName(middleName) === normalizedSignature;

  const signatureMatches =
    firstAndLastMatches || middleInitialMatches || withMiddleNameMatches;

  useEffect(
    () => {
      const isDirty = signature.dirty;

      setIsSigned(true);

      if ((isDirty && !signatureMatches) || showError) {
        setIsSigned(false);
        setError(true);
      }

      if (signatureMatches) {
        setIsSigned(true);
        setError(false);
      }
    },
    [setIsSigned, signature.dirty, signatureMatches, showError],
  );

  return (
    <ErrorableTextInput
      additionalClass="signature-input"
      label={label}
      required={required}
      onValueChange={value => setSignature(value)}
      field={{ value: signature.value, dirty: signature.dirty }}
      errorMessage={
        hasError &&
        'Your signature must match your first and last name as previously entered.'
      }
    />
  );
};

export default SignatureInput;
