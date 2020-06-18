import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import SignatureInput from 'applications/caregivers/components/PreSubmitInfo/components/SignatureInput';

const SignatureCheckbox = ({
  children,
  fullName,
  isRequired,
  label,
  setSignature,
  showError,
  signatures,
}) => {
  const [isSigned, setIsSigned] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [shouldShowError, setError] = useState(null);
  const isSignatureComplete = isSigned && isChecked;

  useEffect(
    () => {
      setSignature({ ...signatures, [label]: isSignatureComplete });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSignatureComplete, fullName.first, fullName.last],
  );

  useEffect(
    () => {
      setError(showError);

      if (isChecked === true) setError(false);
    },
    [showError, setIsChecked, isChecked],
  );

  return (
    <article className="vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--7">
      {children && <header>{children}</header>}

      <SignatureInput
        setIsSigned={setIsSigned}
        label={label}
        fullName={fullName}
        required={isRequired}
        showError={showError}
      />

      <ErrorableCheckbox
        onValueChange={value => setIsChecked(value)}
        label="I certify the information above is correct and true to the best of my knowledge and belief."
        errorMessage={shouldShowError && 'Must certify by checking box'}
        required={isRequired}
      />
    </article>
  );
};

SignatureCheckbox.propTypes = {
  children: PropTypes.any,
  fullName: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.string.isRequired,
  setSignature: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  signatures: PropTypes.object.isRequired,
};

export default SignatureCheckbox;
