import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { normalizeFullName } from '../../utils';
import SignatureInput from './SignatureInput';

const SignatureCheckbox = props => {
  const {
    children,
    fullName,
    isRequired,
    setIsStatementOfTruthSigned,
    setIsStatementOfTruthCertified,
    showError,
    submission,
  } = props;
  const [error, setError] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const hasSubmittedForm = !!submission.status;
  const normalizedFullName = normalizeFullName(fullName, true);

  const handleCheckBoxChange = event => {
    const value = event.target.checked;
    setIsChecked(value);
    setIsStatementOfTruthCertified(value);
  };

  useEffect(
    () => {
      const hasError =
        isChecked === true || hasSubmittedForm ? false : showError;
      const message = hasError ? 'Must certify by checking box' : null;
      setError(message);
    },
    [showError, isChecked, hasSubmittedForm],
  );

  return (
    <fieldset
      data-testid="signature-fieldset"
      className="signature-box vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--3"
    >
      {children ? <>{children}</> : null}

      <SignatureInput
        fullName={normalizedFullName}
        hasSubmittedForm={hasSubmittedForm}
        required={isRequired}
        setIsStatementOfTruthSigned={setIsStatementOfTruthSigned}
        showError={showError}
      />

      <VaCheckbox
        required={isRequired}
        onVaChange={handleCheckBoxChange}
        class="signature-checkbox"
        error={error}
        label="I certify the information above is correct and true to the best of my knowledge and belief."
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
  isRequired: PropTypes.bool,
  setIsStatementOfTruthCertified: PropTypes.func.isRequired,
  setIsStatementOfTruthSigned: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  submission: PropTypes.object.isRequired,
};

export default SignatureCheckbox;
