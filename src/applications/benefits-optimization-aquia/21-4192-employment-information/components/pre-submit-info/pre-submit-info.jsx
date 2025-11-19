/**
 * @module components/PreSubmitInfo
 * @description Pre-submission statement of truth component for VA Form 21-4192
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
 * Note: This component does NOT validate the signature against the veteran's name
 * It only checks that the signature is at least 3 characters long
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.formData - Form data object containing signature and certification state
 * @param {string} props.formData.statementOfTruthSignature - The user's signature input
 * @param {boolean} props.formData.statementOfTruthCertified - Whether user certified the statement
 * @param {boolean} [props.showError=false] - Whether to show validation errors
 * @param {Function} props.setPreSubmit - Action to update pre-submit fields
 * @param {Function} [props.onSectionComplete] - Callback function for form completion status
 * @returns {React.ReactElement} Statement of truth component
 */
const PreSubmitInfo = ({
  formData,
  showError,
  setPreSubmit,
  onSectionComplete,
}) => {
  const [signatureBlurred, setSignatureBlurred] = useState(false);
  const onSectionCompleteRef = useRef(onSectionComplete);

  const STATEMENT_TEXT =
    'I confirm that the identifying information in this form is accurate and has been represented correctly.';

  // Keep ref updated with latest callback
  useEffect(
    () => {
      onSectionCompleteRef.current = onSectionComplete;
    },
    [onSectionComplete],
  );

  // Validate form completion status when formData changes
  useEffect(
    () => {
      const isValid =
        isSignatureValid(formData?.statementOfTruthSignature) &&
        formData?.statementOfTruthCertified === true;

      if (onSectionCompleteRef.current) {
        onSectionCompleteRef.current(isValid);
      }
    },
    [formData?.statementOfTruthSignature, formData?.statementOfTruthCertified],
  );

  const handleSignatureChange = useCallback(
    event => {
      setPreSubmit('statementOfTruthSignature', event.detail.value);
    },
    [setPreSubmit],
  );

  const handleSignatureBlur = useCallback(() => {
    setSignatureBlurred(true);
  }, []);

  const handleCheckboxChange = useCallback(
    event => {
      setPreSubmit('statementOfTruthCertified', event.detail.checked);
    },
    [setPreSubmit],
  );

  const signatureError =
    (showError || signatureBlurred) &&
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
  setPreSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    statementOfTruthSignature: PropTypes.string,
    statementOfTruthCertified: PropTypes.bool,
  }),
  showError: PropTypes.bool,
  onSectionComplete: PropTypes.func,
};

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export { PreSubmitInfo };
export default connect(
  null,
  mapDispatchToProps,
)(PreSubmitInfo);
