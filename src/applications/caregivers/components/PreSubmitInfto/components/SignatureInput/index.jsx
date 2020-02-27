import React, { useEffect, useRef, useState } from 'react';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';

const SignatureInput = ({ fullName, required, label, setIsSigned }) => {
  const inputRef = useRef(null);
  const [signature, setSignature] = useState({
    value: '',
    dirty: false,
  });

  const [hasError, setError] = useState(false);
  const firstAndLast =
    fullName?.first && fullName?.last && `${fullName.first} ${fullName.last}`;
  const signatureMatchesFullName = firstAndLast === signature.value;

  useEffect(
    () => {
      const isDirty = signature.dirty;
      const activeElementId = document.activeElement.id;
      const inputId = inputRef.current.inputId;
      setIsSigned(signatureMatchesFullName);

      if (isDirty && activeElementId !== inputId && !signatureMatchesFullName) {
        setError(true);
      }

      if (signatureMatchesFullName) {
        setError(false);
      }
    },
    [setIsSigned, signature, signatureMatchesFullName],
  );

  return (
    <>
      <label htmlFor="vet-signature-input">
        {label}
        &apos;s full name
      </label>
      <ErrorableTextInput
        ref={inputRef}
        name="vet-signature-input"
        required={required}
        onValueChange={value => setSignature(value)}
        field={{ value: signature.value, dirty: signature.dirty }}
        errorMessage={
          hasError &&
          'Your signature must match your first and last name as previously entered.'
        }
      />
    </>
  );
};

export default SignatureInput;
