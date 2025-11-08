import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { TextInputField } from '@bio-aquia/shared/components/atoms';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Error messages for statement of truth validation
 */
const ERROR_MSG_CHECKBOX = 'You must certify this statement is correct';
const ERROR_MSG_SIGNATURE = 'Please enter your full name';
const ERROR_MSG_TITLE = 'Please enter an organization title';

/**
 * Statement of Truth Item component
 * Renders a single signature box with validation for state/tribal officials
 *
 * @param {Object} props - Component props
 * @param {boolean} props.hasCheckboxError - Whether checkbox has validation error
 * @param {boolean} props.hasSignatureError - Whether signature has validation error
 * @param {boolean} props.hasTitleError - Whether title has validation error
 * @param {string} props.label - Label for this signature item
 * @param {Function} props.setSignatures - Function to update signatures state
 * @param {Object} props.signature - Current signature state
 * @returns {JSX.Element} Statement of truth component
 */
export const StatementOfTruthItem = props => {
  const {
    hasCheckboxError,
    hasSignatureError,
    hasTitleError,
    label,
    setSignatures,
    signature,
  } = props;

  const signatureError = useMemo(
    () => (hasSignatureError ? ERROR_MSG_SIGNATURE : null),
    [hasSignatureError],
  );

  const titleError = useMemo(() => (hasTitleError ? ERROR_MSG_TITLE : null), [
    hasTitleError,
  ]);

  const checkboxError = useMemo(
    () => (hasCheckboxError ? ERROR_MSG_CHECKBOX : null),
    [hasCheckboxError],
  );

  const handleSignatureBlur = useCallback(
    () => {
      if (!signature.signatureDirty) {
        setSignatures(prev => ({
          ...prev,
          [label]: { ...prev[label], signatureDirty: true },
        }));
      }
    },
    [label, setSignatures, signature.signatureDirty],
  );

  const handleTitleBlur = useCallback(
    () => {
      if (!signature.titleDirty) {
        setSignatures(prev => ({
          ...prev,
          [label]: { ...prev[label], titleDirty: true },
        }));
      }
    },
    [label, setSignatures, signature.titleDirty],
  );

  const handleSignatureChange = useCallback(
    event => {
      const { value } = event.detail;

      setSignatures(prev => ({
        ...prev,
        [label]: {
          ...prev[label],
          signatureValue: value,
        },
      }));
    },
    [label, setSignatures],
  );

  const handleTitleChange = useCallback(
    (_, value) => {
      setSignatures(prev => ({
        ...prev,
        [label]: {
          ...prev[label],
          titleValue: value,
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
      heading="Statement of truth"
      inputLabel="Your full name"
      inputValue={signature.signatureValue}
      inputError={signatureError}
      checked={signature.checked}
      checkboxLabel="I certify the information above is correct and true to the best of my knowledge and belief."
      checkboxError={checkboxError}
      onVaInputBlur={handleSignatureBlur}
      onVaInputChange={handleSignatureChange}
      onVaCheckboxChange={handleCheckboxChange}
      hideLegalNote
    >
      I confirm that the identifying information in this form is accurate and
      has been represented correctly.
      <TextInputField
        name="organizationTitle"
        label="Your organization title"
        value={signature.titleValue || ''}
        onChange={handleTitleChange}
        onBlur={handleTitleBlur}
        required
        error={titleError}
        forceShowError={hasTitleError}
        minLength={2}
        maxLength={100}
      />
    </VaStatementOfTruth>
  );
};

StatementOfTruthItem.propTypes = {
  hasCheckboxError: PropTypes.bool,
  hasSignatureError: PropTypes.bool,
  hasTitleError: PropTypes.bool,
  label: PropTypes.string,
  setSignatures: PropTypes.func,
  signature: PropTypes.shape({
    checked: PropTypes.bool,
    signatureDirty: PropTypes.bool,
    signatureValue: PropTypes.string,
    titleDirty: PropTypes.bool,
    titleValue: PropTypes.string,
  }),
};
