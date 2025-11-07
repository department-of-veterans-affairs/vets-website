import React, { useCallback, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Get the claimant's full name based on relationship
 * @param {Object} formData - The form data object
 * @param {Object} formData.claimantRelationship - Claimant relationship data
 * @param {string} formData.claimantRelationship.relationship - Relationship type ('veteran' or other)
 * @param {Object} formData.veteranIdentification - Veteran identification data
 * @param {Object} formData.veteranIdentification.veteranFullName - Veteran's full name
 * @param {Object} formData.claimantInformation - Claimant information data
 * @param {Object} formData.claimantInformation.claimantFullName - Claimant's full name
 * @returns {string} The full name (first middle last) or empty string if not found
 */
const getClaimantFullName = formData => {
  const isVeteranClaimant =
    formData?.claimantRelationship?.relationship === 'veteran';

  let fullName;
  if (isVeteranClaimant) {
    // Use veteran's name
    fullName = formData?.veteranIdentification?.veteranFullName;
  } else {
    // Use claimant's name
    fullName = formData?.claimantInformation?.claimantFullName;
  }

  if (!fullName || typeof fullName !== 'object') {
    return '';
  }

  // Build full name string (first middle last)
  const parts = [fullName.first, fullName.middle, fullName.last].filter(
    Boolean,
  );
  return parts.join(' ');
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
 * Displays federal law notice, statement of truth, and signature validation
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
  const claimantFullName = getClaimantFullName(formData);
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
      const normalizedExpectedName = normalizeName(claimantFullName);
      return normalizedSignature === normalizedExpectedName;
    },
    [claimantFullName],
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

      // Only update if signature values have actually changed
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [dispatch, signature.value, signature.checked, hasSubmittedForm],
  );

  // Notify parent of completion status
  useEffect(
    () => {
      const isComplete = signature.matches && signature.checked;
      // Only call onSectionComplete if the completion status has changed
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
    ? `Your signature must match your full name: ${claimantFullName}`
    : null;
  const checkboxError = hasCheckboxError
    ? 'You must certify the information is correct'
    : null;

  if (!claimantFullName) {
    return (
      <va-alert status="error" className="vads-u-margin-top--4">
        <h3 slot="headline">Missing claimant information</h3>
        <p>
          We need your full name to complete this form. Please go back and
          ensure all required information is provided.
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

// Export the config object as default for use in form configuration
export default {
  required: true,
  CustomComponent: PreSubmitSignature,
};
