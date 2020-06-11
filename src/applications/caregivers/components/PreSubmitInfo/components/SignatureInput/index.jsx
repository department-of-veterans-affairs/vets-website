import React, { useEffect, useRef, useState } from 'react';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';

const SignatureInput = ({ fullName, required, label, setIsSigned }) => {
  const inputRef = useRef(null);
  const firstName = fullName.first?.toLowerCase();
  const lastName = fullName.last?.toLowerCase();
  const middleName = fullName.middle?.toLowerCase();
  const firstLetterOfMiddleName = middleName ? middleName.charAt(0) : '';
  const signatureRegEx = new RegExp(
    `${firstName}(\\s{1,4}|\\s{0,4}${firstLetterOfMiddleName}\\s{0,4}|\\s{0,4}${middleName}\\s{0,4})${lastName}`,
  );
  const [signature, setSignature] = useState({
    value: '',
    dirty: false,
  });
  const [hasError, setError] = useState(false);
  const hasSignatureMatched = signatureRegEx.test(
    signature.value?.toLowerCase(),
  );

  useEffect(
    () => {
      const isDirty = signature.dirty;
      const activeElementId = document.activeElement.id;
      const inputId = inputRef.current.inputId;
      setIsSigned(hasSignatureMatched);

      if (isDirty && activeElementId !== inputId && !hasSignatureMatched) {
        setError(true);
      }

      if (hasSignatureMatched) {
        setError(false);
      }
    },
    [setIsSigned, signature, hasSignatureMatched],
  );

  return (
    <ErrorableTextInput
      additionalClass="signature-input"
      ref={inputRef}
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
