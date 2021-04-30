import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

import SignatureInput from './SignatureInput';
import recordEvent from 'platform/monitoring/record-event';

const SignatureCheckbox = ({
  children,
  fullName,
  isRequired,
  label,
  setSignature,
  showError,
  submission,
  isRepresentative,
}) => {
  const [hasError, setError] = useState(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const isSignatureComplete = isSigned && isChecked;
  const hasSubmittedForm = !!submission.status;

  const createInputLabel = inputLabel =>
    isRepresentative
      ? `Enter your name to sign as the Veteran's representative`
      : `Enter ${inputLabel} full name`;

  useEffect(
    () => {
      setSignature(prevState => {
        return { ...prevState, [label]: isSignatureComplete };
      });
    },

    [isSignatureComplete, label, setSignature],
  );

  useEffect(
    () => {
      setError(showError);

      if (isChecked === true || hasSubmittedForm) setError(false);
    },
    [showError, isChecked, hasSubmittedForm],
  );

  return (
    <article
      data-testid={label}
      className="signature-box vads-u-background-color--gray-lightest vads-u-padding-bottom--6 vads-u-padding-x--3 vads-u-padding-top--1px vads-u-margin-bottom--7"
    >
      {children && <header>{children}</header>}

      <section className="vads-u-display--flex">
        <SignatureInput
          setIsSigned={setIsSigned}
          label={createInputLabel(label)}
          fullName={fullName}
          required={isRequired}
          showError={showError}
          hasSubmittedForm={hasSubmittedForm}
          isRepresentative={isRepresentative}
        />

        {isRepresentative && (
          <p className="on-behalf-representative">
            On behalf of
            <strong className="vads-u-font-size--lg">
              {fullName.first} {fullName.middle} {fullName.last}
            </strong>
          </p>
        )}
      </section>

      <Checkbox
        onValueChange={value => {
          setIsChecked(value);
          recordEvent({
            'caregivers-poa-certification-checkbox-checked': value,
            fullName,
            label,
            isRepresentative,
          });
        }}
        label="I certify the information above is correct and true to the best of my knowledge and belief."
        errorMessage={hasError && 'Must certify by checking box'}
        required={isRequired}
      />
    </article>
  );
};

SignatureCheckbox.propTypes = {
  children: PropTypes.any.isRequired,
  fullName: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  setSignature: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  signatures: PropTypes.object.isRequired,
  submission: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  isRepresentative: PropTypes.bool,
};

export default SignatureCheckbox;
