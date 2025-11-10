/**
 * @module components/PreSubmitInfo
 * @description Pre-submission statement of truth component for VA Form 21-4192
 */

import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';

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
 * @param {string} props.formData.signature - The user's signature input
 * @param {boolean} props.formData.statementOfTruthCertified - Whether user certified the statement
 * @param {boolean} [props.showError=false] - Whether to show validation errors
 * @param {Function} [props.onSectionComplete] - Callback function for form completion status
 * @returns {React.ReactElement} Statement of truth component
 */
export const PreSubmitInfo = ({ formData, showError, onSectionComplete }) => {
  const dispatch = useDispatch();
  const { certification } = formData;
  const [signatureBlurred, setsignatureBlurred] = useState(false);

  const STATEMENT_TEXT =
    'I confirm that the identifying information in this form is accurate and has been represented correctly.';

  // Validate form completion status when formData changes
  useEffect(
    () => {
      const isValid =
        isSignatureValid(certification?.signature) && certification?.certified;
      onSectionComplete?.(isValid);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [certification?.signature, certification?.certified],
  );

  const handleSignatureChange = useCallback(
    event => {
      dispatch(
        setData({
          ...formData,
          certification: {
            ...formData?.certification,
            signature: event.detail.value,
          },
        }),
      );
    },
    [dispatch, formData],
  );

  const handleSignatureBlur = () => {
    setsignatureBlurred(true);
  };

  const handleCheckboxChange = useCallback(
    event => {
      dispatch(
        // setPreSubmitAction('statementOfTruthCertified', event.detail.checked),
        setData({
          ...formData,
          certification: {
            ...formData?.certification,
            certified: event.detail.checked,
          },
        }),
      );
    },
    [dispatch, formData],
  );

  const signatureError =
    (showError || signatureBlurred) &&
    !isSignatureValid(certification?.signature)
      ? 'Please enter a name (at least 3 characters)'
      : undefined;

  const checkboxError =
    showError && !certification?.certified
      ? 'You must certify by checking the box'
      : undefined;

  return (
    <VaStatementOfTruth
      heading="Statement of truth"
      inputLabel="Your full name"
      inputValue={certification?.signature || ''}
      inputMessageAriaDescribedby={`Statement of truth: ${STATEMENT_TEXT}`}
      inputError={signatureError}
      checked={certification?.certified || false}
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
    certification: PropTypes.shape({
      signature: PropTypes.string,
      certified: PropTypes.bool,
    }),
  }),
  showError: PropTypes.bool,
  onSectionComplete: PropTypes.func,
};

PreSubmitInfo.defaultProps = {
  formData: {
    certification: {
      signature: '',
      certified: false,
    },
  },
  showError: false,
  onSectionComplete: undefined,
};

export default PreSubmitInfo;
