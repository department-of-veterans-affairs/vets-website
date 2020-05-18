import React, { useEffect, useState } from 'react';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import SignatureInput from 'applications/caregivers/components/PreSubmitInfo/components/SignatureInput';

const SignatureCheckbox = ({
  fullName,
  label,
  children,
  signSignature,
  signatures,
}) => {
  const [isSigned, setIsSigned] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const isSignatureComplete = isSigned && isChecked;

  useEffect(
    () => {
      signSignature({ ...signatures, [label]: isSignatureComplete });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signSignature, label, isSignatureComplete],
  );

  return (
    <article className="vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--1p5 vads-u-padding-top--1px vads-u-margin-bottom--7">
      {children && <header>{children}</header>}

      <SignatureInput
        setIsSigned={setIsSigned}
        label={label}
        fullName={fullName}
      />

      <ErrorableCheckbox
        onValueChange={event => setIsChecked(event)}
        label="I certify the information above is correct and true to the best of my knowledge and belief."
      />
    </article>
  );
};

export default SignatureCheckbox;
