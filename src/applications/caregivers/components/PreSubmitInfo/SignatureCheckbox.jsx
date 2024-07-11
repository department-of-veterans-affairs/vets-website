import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from 'platform/monitoring/record-event';
import { normalizeFullName, replaceStrValues } from '../../utils/helpers';
import SignatureInput from './SignatureInput';
import content from '../../locales/en/content.json';

const SignatureCheckbox = props => {
  const {
    children,
    fullName,
    isRequired,
    label,
    setSignatures,
    showError,
    submission,
    isRepresentative,
  } = props;
  const [hasError, setError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const hasSubmittedForm = !!submission.status;
  const normalizedFullName = normalizeFullName(fullName, true);
  const representativeLabelId = isRepresentative
    ? `${label}-signature-label`
    : undefined;
  const ariaDescribedbyMessage = isRepresentative
    ? replaceStrValues(
        content['sign-as-rep-on-behalf-text'],
        normalizedFullName,
      )
    : undefined;

  const handleCheck = event => {
    setIsChecked(
      event.target.shadowRoot.querySelector('#checkbox-element').checked,
    );
    recordEvent({
      'caregivers-poa-certification-checkbox-checked': event.target.value,
      fullName,
      label,
      isRepresentative,
    });
  };

  useEffect(
    () => {
      const error = isChecked === true || hasSubmittedForm ? false : showError;
      setError(error);
    },
    [showError, isChecked, hasSubmittedForm],
  );

  return (
    <fieldset
      data-testid={label}
      className="signature-box vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--5"
    >
      {children ? <>{children}</> : null}

      <SignatureInput
        ariaDescribedBy={ariaDescribedbyMessage}
        label={label}
        fullName={normalizedFullName}
        required={isRequired}
        showError={showError}
        hasSubmittedForm={hasSubmittedForm}
        isRepresentative={isRepresentative}
        setSignatures={setSignatures}
        isChecked={isChecked}
      />

      {isRepresentative && (
        <p className="signature-box--representative" id={representativeLabelId}>
          {content['signature-on-behalf-text']}
          <strong className="vads-u-font-size--lg">{normalizedFullName}</strong>
        </p>
      )}

      <VaCheckbox
        required={isRequired}
        onVaChange={handleCheck}
        class="signature-checkbox"
        error={hasError ? content['validation-signature-required'] : undefined}
        label={content['signature-checkbox-label']}
      />
    </fieldset>
  );
};

SignatureCheckbox.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  fullName: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  setSignatures: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  submission: PropTypes.object.isRequired,
  isRepresentative: PropTypes.bool,
  isRequired: PropTypes.bool,
};

export default SignatureCheckbox;
