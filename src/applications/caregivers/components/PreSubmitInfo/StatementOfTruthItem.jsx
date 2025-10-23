import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { VaStatementOfTruth } from '../../utils/imports';
import { replaceStrValues } from '../../utils/helpers';
import content from '../../locales/en/content.json';

// declare static content
export const STATEMENT_HEADING = content['statement-of-truth--title'];
export const STATEMENT_INPUT_LABEL = content['statement-of-truth--input-label'];
export const STATEMENT_CHECKBOX_LABEL =
  content['statement-of-truth--checkbox-label'];
export const ERROR_MSG_CHECKBOX = content['validation-signature-required'];
export const ERROR_MSG_INPUT = content['validation-statement-of-truth'];
export const ERROR_MSG_INPUT_REP =
  content['validation-statement-of-truth--rep'];

const StatementOfTruthItem = props => {
  const {
    fullName,
    hasCheckboxError,
    hasInputError,
    isRep,
    label,
    setSignatures,
    signature,
    statementText,
  } = props;

  const heading = replaceStrValues(STATEMENT_HEADING, label);
  const inputLabel = replaceStrValues(STATEMENT_INPUT_LABEL, label);

  const inputError = useMemo(
    () => {
      const errorMessage = isRep
        ? ERROR_MSG_INPUT_REP
        : replaceStrValues(ERROR_MSG_INPUT, fullName);
      return hasInputError ? errorMessage : null;
    },
    [fullName, hasInputError, isRep],
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
          matches: isRep
            ? true
            : value.toLowerCase() === fullName.toLowerCase(),
          value,
        },
      }));
    },
    [fullName, isRep, label, setSignatures],
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
      checkboxLabel={STATEMENT_CHECKBOX_LABEL}
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
  fullName: PropTypes.string,
  hasCheckboxError: PropTypes.bool,
  hasInputError: PropTypes.bool,
  isRep: PropTypes.bool,
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
