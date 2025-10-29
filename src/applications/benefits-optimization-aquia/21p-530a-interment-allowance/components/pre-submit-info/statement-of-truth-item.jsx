import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Error messages for statement of truth validation
 */
const ERROR_MSG_CHECKBOX = 'You must certify this statement is correct';

/**
 * Normalize names for comparison: trim, lowercase, remove extra spaces
 */
const normalizeName = name => {
  if (!name || typeof name !== 'string') return '';
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
};

/**
 * Statement of Truth Item component
 * Renders a single signature box with validation for state/tribal officials
 *
 * @param {Object} props - Component props
 * @param {boolean} props.hasCheckboxError - Whether checkbox has validation error
 * @param {boolean} props.hasInputError - Whether input has validation error
 * @param {string} props.label - Label for this signature item
 * @param {string} props.expectedName - Expected name to validate signature against
 * @param {Function} props.setSignatures - Function to update signatures state
 * @param {Object} props.signature - Current signature state
 * @param {Array} props.statementText - Text paragraphs for the statement
 * @returns {JSX.Element} Statement of truth component
 */
export const StatementOfTruthItem = props => {
  const {
    hasCheckboxError,
    hasInputError,
    label,
    expectedName,
    setSignatures,
    signature,
    statementText,
  } = props;

  const heading = `${label} Statement of Truth`;
  const inputLabel = `${label}'s signature`;

  const inputError = useMemo(
    () =>
      hasInputError
        ? `Your signature must match the burial benefits recipient full name: ${expectedName}`
        : null,
    [hasInputError, expectedName],
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
      const { value } = event.detail;
      const trimmedValue = value.trim();
      const normalizedSignature = normalizeName(trimmedValue);
      const normalizedExpectedName = normalizeName(expectedName);
      const matches = normalizedSignature === normalizedExpectedName;

      setSignatures(prev => ({
        ...prev,
        [label]: {
          ...prev[label],
          matches,
          value, // Store the raw value so user can type spaces
        },
      }));
    },
    [label, expectedName, setSignatures],
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

  // Re-validate signature when expectedName changes
  useEffect(
    () => {
      if (signature.value) {
        const trimmedValue = signature.value.trim();
        const normalizedSignature = normalizeName(trimmedValue);
        const normalizedExpectedName = normalizeName(expectedName);
        const matches = normalizedSignature === normalizedExpectedName;

        if (signature.matches !== matches) {
          setSignatures(prev => ({
            ...prev,
            [label]: {
              ...prev[label],
              matches,
            },
          }));
        }
      }
    },
    [expectedName, signature.value, signature.matches, label, setSignatures],
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
  expectedName: PropTypes.string,
  setSignatures: PropTypes.func,
  signature: PropTypes.shape({
    checked: PropTypes.bool,
    dirty: PropTypes.bool,
    matches: PropTypes.bool,
    value: PropTypes.string,
  }),
  statementText: PropTypes.arrayOf(PropTypes.string),
};
