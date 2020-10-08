import React, { useEffect, useState } from 'react';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';

const SignatureInput = ({ fullName, required, label, setIsSigned }) => {
  const [hasError, setError] = useState(false);
  const firstName = fullName.first?.toLowerCase() || '';
  const lastName = fullName.last?.toLowerCase() || '';
  const middleName = fullName.middle?.toLowerCase() || '';

  const [signature, setSignature] = useState({
    value: '',
    dirty: false,
  });

  const firstLetterOfMiddleName =
    middleName === undefined ? '' : middleName.charAt(0);

  const removeSpaces = string =>
    string
      .split(' ')
      .join('')
      .toLocaleLowerCase();

  const getName = (middle = '') =>
    removeSpaces(`${firstName}${middle}${lastName}`);

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

  useEffect(
    () => {
      const isDirty = signature.dirty;

      if (isDirty && !signatureMatches) {
        setIsSigned(false);
        setError(true);
      }

      if (isDirty && signatureMatches) {
        setIsSigned(true);
        setError(false);
      }
    },
    [setIsSigned, signature.dirty, signatureMatches],
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
