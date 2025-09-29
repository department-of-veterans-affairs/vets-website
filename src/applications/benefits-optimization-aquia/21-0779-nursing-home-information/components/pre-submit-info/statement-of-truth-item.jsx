import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Error messages for statement of truth validation
 */
const ERROR_MSG_CHECKBOX = 'You must certify this statement is correct';
const ERROR_MSG_INPUT_OFFICIAL =
  'Please sign your full name as the nursing home official';

/**
 * Statement of Truth Item component
 * Renders a single signature box with validation for nursing home officials
 *
 * @param {Object} props - Component props
 * @param {boolean} props.hasCheckboxError - Whether checkbox has validation error
 * @param {boolean} props.hasInputError - Whether input has validation error
 * @param {string} props.label - Label for this signature item
 * @param {Function} props.setSignatures - Function to update signatures state
 * @param {Object} props.signature - Current signature state
 * @param {Array} props.statementText - Text paragraphs for the statement
 * @returns {JSX.Element} Statement of truth component
 */
const StatementOfTruthItem = props => {
  const {
    hasCheckboxError,
    hasInputError,
    label,
    setSignatures,
    signature,
    statementText,
  } = props;

  const heading = `${label} Statement of Truth`;
  const inputLabel = `${label}'s signature`;

  const inputError = useMemo(
    () => (hasInputError ? ERROR_MSG_INPUT_OFFICIAL : null),
    [hasInputError],
  );

  const checkboxError = useMemo(
    () => (hasCheckboxError ? ERROR_MSG_CHECKBOX : null),
    [hasCheckboxError],
  );

  const handleInputBlur = useCallback(
    () => {
      if (!signature.dirty) {
        setSignatures(prev => ({
          ...prev,
          [label]: { ...prev[label], dirty: true },
        }));
      }
    },
    [label, setSignatures, signature.dirty],
  );

  const handleInputChange = useCallback(
    event => {
      const value = event.detail.value.trim();
      setSignatures(prev => ({
        ...prev,
        [label]: {
          ...prev[label],
          // For officials, just need a non-empty signature
          matches: value.length > 0,
          value,
        },
      }));
    },
    [label, setSignatures],
  );

  const handleCheckboxChange = useCallback(
    event => {
      setSignatures(prev => ({
        ...prev,
        [label]: { ...prev[label], checked: event.detail.checked },
      }));
    },
    [label, setSignatures],
  );

  return (
    <VaStatementOfTruth
      name={label}
      heading={heading}
      inputLabel={inputLabel}
      inputValue={signature.value}
      inputError={inputError}
      checked={signature.checked}
      checkboxLabel="I certify the information above is correct and true to the best of my knowledge and belief."
      checkboxError={checkboxError}
      onVaInputBlur={handleInputBlur}
      onVaInputChange={handleInputChange}
      onVaCheckboxChange={handleCheckboxChange}
      hideLegalNote
    >
      {statementText.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </VaStatementOfTruth>
  );
};

StatementOfTruthItem.propTypes = {
  hasCheckboxError: PropTypes.bool,
  hasInputError: PropTypes.bool,
  label: PropTypes.string,
  setSignatures: PropTypes.func,
  signature: PropTypes.shape({
    checked: PropTypes.bool,
    dirty: PropTypes.bool,
    matches: PropTypes.bool,
    value: PropTypes.string,
  }),
  statementText: PropTypes.arrayOf(PropTypes.string),
};

export default StatementOfTruthItem;
