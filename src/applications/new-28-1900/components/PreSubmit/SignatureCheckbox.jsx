import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { normalizeFullName } from '../../utils/helpers';
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
  } = props;
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const hasSubmittedForm = !!submission.status;
  const normalizedFullName = normalizeFullName(fullName, true);

  const handleCheck = event => {
    const value = event.target.checked;
    setIsChecked(value);
    setSignatures(prev => ({
      ...prev,
      [label]: { ...prev[label], checked: value },
    }));
  };

  useEffect(
    () => {
      const hasError =
        isChecked === true || hasSubmittedForm ? false : showError;
      const message = hasError
        ? content['validation-signature-required']
        : null;
      setError(message);
    },
    [showError, isChecked, hasSubmittedForm],
  );

  return (
    <fieldset
      data-testid={label}
      className="signature-box vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--3"
    >
      {children ? <>{children}</> : null}

      <SignatureInput
        label={label}
        fullName={normalizedFullName}
        required={isRequired}
        showError={showError}
        hasSubmittedForm={hasSubmittedForm}
        setSignatures={setSignatures}
        isChecked={isChecked}
      />

      <VaCheckbox
        required={isRequired}
        onVaChange={handleCheck}
        class="signature-checkbox"
        error={error}
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
  isRequired: PropTypes.bool,
};

export default SignatureCheckbox;
