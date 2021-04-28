import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

const SignatureInput = ({
  fullName,
  required,
  label,
  setIsSigned,
  showError,
  hasSubmit,
  isRepresentative,
}) => {
  const [hasError, setError] = useState(false);
  const firstName = fullName.first?.toLowerCase() || '';
  const lastName = fullName.last?.toLowerCase() || '';
  const middleName = fullName.middle?.toLowerCase() || '';
  const errorMessage = isRepresentative
    ? 'You must sign as representative.'
    : 'Your signature must match your first and last name as previously entered.';

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

      /* show error if user has touched input and signature does not match
         show error if there is a form error and has not been submitted */
      if ((isDirty && !signatureMatches) || (showError && !hasSubmit)) {
        setIsSigned(false);
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
        setIsSigned(true);
        setError(false);
      }
    },
    [
      setIsSigned,
      signature.dirty,
      signatureMatches,
      showError,
      hasSubmit,
      isRepresentative,
      normalizedSignature,
    ],
  );

  return (
    <TextInput
      additionalClass="signature-input"
      label={label}
      required={required}
      onValueChange={value => setSignature(value)}
      field={{ value: signature.value, dirty: signature.dirty }}
      errorMessage={hasError && errorMessage}
    />
  );
};

SignatureInput.propTypes = {
  fullName: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  setIsSigned: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  hasSubmit: PropTypes.bool.isRequired,
  isRepresentative: PropTypes.bool,
  required: PropTypes.bool,
};

export default SignatureInput;
