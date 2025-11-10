/**
 * @module components/PreSubmitInfo
 * @description Pre-submission statement of truth component for VA Form 21-4192
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

/**
 * Validates signature input
 * Requires at least 3 non-whitespace characters
 *
 * @param {string} signatureValue - The signature input value
 * @returns {boolean} - True if valid, false otherwise
 */
export const isSignatureValid = signatureValue => {
  if (!signatureValue) return false;
  return signatureValue.trim().length > 2;
};

/**
 * PreSubmitInfo component for VA Form 21-4192
 * Displays statement of truth with signature input and certification checkbox
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.formData - Form data object containing signature and certification state
 * @param {string} props.formData.statementOfTruthSignature - The user's signature input
 * @param {boolean} props.formData.statementOfTruthCertified - Whether user certified the statement
 * @param {boolean} [props.showError=false] - Whether to show validation errors
 * @param {Function} [props.onSectionComplete] - Callback function for form completion status
 * @returns {React.ReactElement} Statement of truth component
 */
export const PreSubmitInfo = ({ formData, showError, onSectionComplete }) => {
  const dispatch = useDispatch();
  const [
    statementOfTruthSignatureBlurred,
    setStatementOfTruthSignatureBlurred,
  ] = useState(false);

  const STATEMENT_TEXT =
    'I confirm that the identifying information in this form is accurate and has been represented correctly.';

  // Validate form completion status when formData changes
  useEffect(
    () => {
      const isValid =
        isSignatureValid(formData?.statementOfTruthSignature) &&
        formData?.statementOfTruthCertified;
      onSectionComplete?.(isValid);
    },
    [
      formData?.statementOfTruthSignature,
      formData?.statementOfTruthCertified,
      onSectionComplete,
    ],
  );

  const handleSignatureChange = event => {
    dispatch(
      setPreSubmitAction('statementOfTruthSignature', event.detail.value),
    );
  };

  const handleSignatureBlur = () => {
    setStatementOfTruthSignatureBlurred(true);
  };

  const handleCheckboxChange = event => {
    dispatch(
      setPreSubmitAction('statementOfTruthCertified', event.detail.checked),
    );
  };

  const signatureError =
    (showError || statementOfTruthSignatureBlurred) &&
    !isSignatureValid(formData?.statementOfTruthSignature)
      ? 'Please enter a name (at least 3 characters)'
      : undefined;

  const checkboxError =
    showError && !formData?.statementOfTruthCertified
      ? 'You must certify by checking the box'
      : undefined;

  return (
    <VaStatementOfTruth
      heading="Statement of truth"
      inputLabel="Your full name"
      inputValue={formData?.statementOfTruthSignature || ''}
      inputMessageAriaDescribedby={`Statement of truth: ${STATEMENT_TEXT}`}
      inputError={signatureError}
      checked={formData?.statementOfTruthCertified || false}
      onVaInputChange={handleSignatureChange}
      onVaInputBlur={handleSignatureBlur}
      onVaCheckboxChange={handleCheckboxChange}
      checkboxError={checkboxError}
    >
      <p>{STATEMENT_TEXT}</p>
    </VaStatementOfTruth>
  );
};

PreSubmitInfo.propTypes = {
  formData: PropTypes.shape({
    statementOfTruthSignature: PropTypes.string,
    statementOfTruthCertified: PropTypes.bool,
  }),
  showError: PropTypes.bool,
  onSectionComplete: PropTypes.func,
};

PreSubmitInfo.defaultProps = {
  formData: {
    statementOfTruthSignature: '',
    statementOfTruthCertified: false,
  },
  showError: false,
  onSectionComplete: undefined,
};

export default PreSubmitInfo;
