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
    signature.value.startsWith(fullName.first) &&
    signature.value.endsWith(fullName.last);

  useEffect(
    () => {
      const isDirty = signature.dirty;
      const activeElementId = document.activeElement.id;
      const inputId = inputRef.current.inputId;
      setIsSigned(firstAndLast);

      if (isDirty && activeElementId !== inputId && !firstAndLast) {
        setError(true);
      }

      if (firstAndLast) {
        setError(false);
      }
    },
    [setIsSigned, signature, firstAndLast],
  );

  return (
    <>
      <label htmlFor="vet-signature-input">{label}</label>
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
