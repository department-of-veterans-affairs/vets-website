import React, { useCallback, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Get the burial benefits recipient organization's full name
 * @param {Object} formData - The form data object
 * @param {Object} formData.burialBenefitsRecipient - Burial benefits recipient data
 * @param {string} formData.burialBenefitsRecipient.fullName - Organization's full name
 * @returns {string} The full name or empty string if not found
 */
const getRecipientFullName = formData => {
  const fullName = formData?.burialBenefitsRecipient?.fullName;

  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  return fullName.trim();
};

/**
 * Normalize names for comparison: trim, lowercase, remove extra spaces
 * @param {string} name - The name to normalize
 * @returns {string} The normalized name or empty string if invalid input
 */
const normalizeName = name => {
  if (!name || typeof name !== 'string') return '';
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
};

/**
 * PreSubmitSignature component
 * Displays statement of truth and signature validation
 * Uses VaStatementOfTruth web component
 * @param {Object} props - Component props
 * @param {Object} props.formData - The form data object
 * @param {boolean} props.showError - Whether to show validation errors
 * @param {Function} props.onSectionComplete - Callback when section validation changes
 * @returns {JSX.Element} The signature validation component
 */
export const PreSubmitSignature = ({
  formData,
  showError,
  onSectionComplete,
}) => {
  const recipientFullName = getRecipientFullName(formData);
  const dispatch = useDispatch();
  const submission = useSelector(state => state.form.submission);
  const hasSubmittedForm = Boolean(submission.status);
  const prevCompleteRef = useRef(null);

  const [signature, setSignature] = useState({
    value: '',
    checked: false,
    dirty: false,
    matches: false,
  });

  // Validate signature matches expected name
  const validateSignature = useCallback(
    value => {
      const normalizedSignature = normalizeName(value);
      const normalizedExpectedName = normalizeName(recipientFullName);
      return normalizedSignature === normalizedExpectedName;
    },
    [recipientFullName],
  );

  // Handle input change
  const handleInputChange = useCallback(
    event => {
      const value = event.detail.value.trim();
      const matches = validateSignature(value);

      setSignature(prev => ({
        ...prev,
        value,
        matches,
      }));
    },
    [validateSignature],
  );

  // Handle input blur
  const handleInputBlur = useCallback(() => {
    setSignature(prev => ({
      ...prev,
      dirty: true,
    }));
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = useCallback(event => {
    setSignature(prev => ({
      ...prev,
      checked: event.detail.checked,
    }));
  }, []);

  // Save signature data to form data
  useEffect(
    () => {
      if (hasSubmittedForm) return;

      if (
        formData.signature !== signature.value ||
        formData.certificationChecked !== signature.checked
      ) {
        dispatch(
          setData({
            ...formData,
            signature: signature.value,
            certificationChecked: signature.checked,
          }),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, signature.value, signature.checked, hasSubmittedForm],
  );

  // Notify parent of completion status
  useEffect(
    () => {
      const isComplete = signature.matches && signature.checked;
      if (prevCompleteRef.current !== isComplete) {
        prevCompleteRef.current = isComplete;
        onSectionComplete(isComplete);
      }
    },
    [signature.matches, signature.checked, onSectionComplete],
  );

  // Determine error messages
  const hasInputError =
    showError && (!signature.matches || (signature.dirty && !signature.value));
  const hasCheckboxError = showError && !signature.checked;

  const inputError = hasInputError
    ? `Your signature must match the burial benefits recipient full name: ${recipientFullName}`
    : null;
  const checkboxError = hasCheckboxError
    ? 'You must certify the information is correct'
    : null;

  if (!recipientFullName) {
    return (
      <va-alert status="error" className="vads-u-margin-top--4">
        <h3 slot="headline">Missing recipient information</h3>
        <p>
          We need the burial benefits recipient full name to complete this form.
          Please go back and ensure all required information is provided.
        </p>
      </va-alert>
    );
  }

  return (
    <div className="vads-u-margin-y--4">
      <VaStatementOfTruth
        name="claimant-signature"
        heading="Statement of truth"
        inputLabel="Your full name"
        inputValue={signature.value}
        inputError={inputError}
        checked={signature.checked}
        checkboxLabel="I certify that the information above is correct and true to the best of my knowledge and belief."
        checkboxError={checkboxError}
        onVaInputChange={handleInputChange}
        onVaInputBlur={handleInputBlur}
        onVaCheckboxChange={handleCheckboxChange}
      >
        <p>
          I confirm that the identifying information in this form is accurate
          and has been represented correctly.
        </p>
      </VaStatementOfTruth>
    </div>
  );
};

PreSubmitSignature.propTypes = {
  formData: PropTypes.object.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
  showError: PropTypes.bool,
};

export default {
  required: true,
  CustomComponent: PreSubmitSignature,
};
