import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

import SignatureInput from './SignatureInput';
import recordEvent from 'platform/monitoring/record-event';

const SignatureCheckbox = ({
  children,
  fullName,
  isRequired,
  label,
  setSignatures,
  showError,
  submission,
  isRepresentative,
}) => {
  const [hasError, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const hasSubmittedForm = !!submission.status;

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

      <section className={classNames({ 'wide-input': isRepresentative })}>
        <SignatureInput
          label={label}
          fullName={fullName}
          required={isRequired}
          showError={showError}
          hasSubmittedForm={hasSubmittedForm}
          isRepresentative={isRepresentative}
          setSignatures={setSignatures}
          isChecked={isChecked}
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
  setSignatures: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  signatures: PropTypes.object.isRequired,
  submission: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  isRepresentative: PropTypes.bool,
};

export default SignatureCheckbox;
