import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { isClaimantVeteran } from '../../utils/relationship-helpers';
import {
  getVeteranName,
  getClaimantName,
  getVeteranFullNameWithMiddle,
  getClaimantFullNameWithMiddle,
} from '../../utils/name-helpers';

/**
 * Normalize names for comparison: trim, lowercase, remove extra spaces
 * @param {string} name - The name to normalize
 * @returns {string} The normalized name or empty string if invalid input
 */
export const normalizeName = name => {
  if (!name || typeof name !== 'string') return '';
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
};

/**
 * Get all valid signer names from form data
 * Returns an array of names that are valid for signing:
 * - Always includes veteran/beneficiary name (with and without middle)
 * - Includes claimant name if claimant is not the veteran (with and without middle)
 *
 * @param {Object} formData - The form data
 * @returns {string[]} Array of valid signer names
 */
export const getValidSignerNames = formData => {
  const names = [];

  // Veteran/beneficiary can always sign (both with and without middle name)
  const veteranName = getVeteranName(formData, '');
  if (veteranName) {
    names.push(veteranName);
  }
  const veteranNameWithMiddle = getVeteranFullNameWithMiddle(formData);
  if (veteranNameWithMiddle) {
    names.push(veteranNameWithMiddle);
  }

  // If claimant is not the veteran, they can also sign (both with and without middle name)
  if (!isClaimantVeteran(formData)) {
    const claimantName = getClaimantName(formData, '');
    if (claimantName) {
      names.push(claimantName);
    }
    const claimantNameWithMiddle = getClaimantFullNameWithMiddle(formData);
    if (claimantNameWithMiddle) {
      names.push(claimantNameWithMiddle);
    }
  }

  return names;
};

/**
 * Check if signature matches any valid signer name
 * @param {string} signature - The signature to validate
 * @param {string[]} validNames - Array of valid names
 * @returns {boolean} True if signature matches any valid name
 */
export const isSignatureValid = (signature, validNames) => {
  const normalizedSignature = normalizeName(signature);
  return validNames.some(name => normalizeName(name) === normalizedSignature);
};

/**
 * PreSubmitSignature component for VA Form 21-2680
 * Allows either the veteran/beneficiary OR the claimant to sign the form
 *
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {boolean} props.showError - Whether to show validation errors
 * @param {Function} props.onSectionComplete - Callback when section is complete
 * @returns {JSX.Element} PreSubmit signature component
 */
export const PreSubmitSignature = ({
  formData,
  showError,
  onSectionComplete,
}) => {
  const dispatch = useDispatch();
  const submission = useSelector(state => state.form.submission);
  const hasSubmittedForm = Boolean(submission.status);
  const prevCompleteRef = useRef(null);

  const validSignerNames = getValidSignerNames(formData);
  const veteranName = getVeteranName(formData, '');
  const hasClaimant = !isClaimantVeteran(formData);
  const claimantName = hasClaimant ? getClaimantName(formData, '') : '';

  const [signature, setSignature] = useState({
    value: formData?.statementOfTruthSignature || '',
    checked: formData?.statementOfTruthCertified || false,
    dirty: false,
    matches: false,
  });

  // Initialize matches state based on existing form data
  useEffect(() => {
    if (formData?.statementOfTruthSignature) {
      const matches = isSignatureValid(
        formData.statementOfTruthSignature,
        validSignerNames,
      );
      setSignature(prev => ({
        ...prev,
        value: formData.statementOfTruthSignature,
        checked: formData?.statementOfTruthCertified || false,
        matches,
      }));
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate signature matches any valid signer name
  const validateSignature = useCallback(
    value => isSignatureValid(value, validSignerNames),
    [validSignerNames],
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

  // Save signature data to form data using platform standard field names
  useEffect(
    () => {
      if (hasSubmittedForm) return;

      // Only update if signature values have actually changed
      if (
        formData.statementOfTruthSignature !== signature.value ||
        formData.statementOfTruthCertified !== signature.checked
      ) {
        dispatch(
          setData({
            ...formData,
            statementOfTruthSignature: signature.value,
            statementOfTruthCertified: signature.checked,
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
      // Only call onSectionComplete if the completion status has changed
      if (prevCompleteRef.current !== isComplete) {
        prevCompleteRef.current = isComplete;
        onSectionComplete(isComplete);
      }
    },
    [signature.matches, signature.checked, onSectionComplete],
  );

  // Determine error messages
  const [inputError, setInputError] = useState(null);
  const [checkboxError, setCheckboxError] = useState(null);

  useEffect(
    () => {
      // Avoid showing validation errors while the form is submitting
      if (hasSubmittedForm) {
        return;
      }
      const hasInputError =
        showError &&
        (!signature.matches || (signature.dirty && !signature.value));
      const hasCheckboxError = showError && !signature.checked;

      // Build the accepted names message
      let acceptedNamesMessage;
      if (hasClaimant && claimantName) {
        acceptedNamesMessage = `Please enter your name exactly as it appears on your application: ${veteranName} or ${claimantName}`;
      } else {
        acceptedNamesMessage = `Please enter your name exactly as it appears on your application: ${veteranName}`;
      }

      setInputError(hasInputError ? acceptedNamesMessage : null);
      setCheckboxError(
        hasCheckboxError ? 'You must certify the information is correct' : null,
      );
    },
    [
      showError,
      signature.matches,
      signature.dirty,
      signature.value,
      signature.checked,
      veteranName,
      claimantName,
      hasClaimant,
      hasSubmittedForm,
    ],
  );

  // Show error if no valid names are available
  if (validSignerNames.length === 0) {
    return (
      <va-alert status="error" className="vads-u-margin-top--4">
        <h3 slot="headline">Missing information</h3>
        <p>
          We need your full name to complete this form. Please go back and
          ensure all required information is provided.
        </p>
      </va-alert>
    );
  }

  // Build the statement body based on who can sign
  const statementBody = hasClaimant
    ? `I, the undersigned, confirm that the identifying information in this form is accurate and has been represented correctly. Accepted signatures: ${veteranName}${
        claimantName ? ` or ${claimantName}` : ''
      }.`
    : `I, ${veteranName}, confirm that the identifying information in this form is accurate and has been represented correctly.`;

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <p
        id="statement-of-truth-declaration"
        className="vads-u-margin-bottom--4"
      >
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information (See 18
        U.S.C. 1001).
      </p>

      <div aria-describedby="statement-of-truth-declaration">
        <VaStatementOfTruth
          name="veteran-claimant-signature"
          heading="Statement of Truth"
          inputLabel="Your full name"
          inputValue={signature.value}
          inputError={inputError}
          inputMessageAriaDescribedby={`Statement of truth: ${statementBody}`}
          checked={signature.checked}
          checkboxLabel="I certify the information above is correct and true to the best of my knowledge and belief."
          checkboxError={checkboxError}
          onVaInputChange={handleInputChange}
          onVaInputBlur={handleInputBlur}
          onVaCheckboxChange={handleCheckboxChange}
          hideLegalNote
        >
          {statementBody}
        </VaStatementOfTruth>
      </div>
    </div>
  );
};

PreSubmitSignature.propTypes = {
  formData: PropTypes.object.isRequired,
  showError: PropTypes.bool.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
};

export const preSubmitSignatureConfig = {
  required: true,
  CustomComponent: PreSubmitSignature,
};
