import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
 * Displays signature boxes for nursing home official to certify form information
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
  const { nursingOfficialInformation = {} } = formData;
  // Get the official's name from form data
  const officialsName = `${nursingOfficialInformation?.fullName?.first ||
    ''} ${nursingOfficialInformation?.fullName?.last || ''}`.trim();

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
      const normalizedExpectedName = normalizeName(officialsName);
      return normalizedSignature === normalizedExpectedName;
    },
    [officialsName],
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
      // Avoid showing validation errors while the form is submitting to prevent a flash on submit
      if (hasSubmittedForm) {
        return;
      }
      const hasInputError =
        showError &&
        (!signature.matches || (signature.dirty && !signature.value));
      const hasCheckboxError = showError && !signature.checked;

      setInputError(
        hasInputError
          ? `Your signature must match your full name: ${officialsName}`
          : null,
      );
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
      officialsName,
      hasSubmittedForm,
    ],
  );

  if (!officialsName) {
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
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <p
        id="nursing-home-statements-declaration"
        className="vads-u-margin-bottom--4"
      >
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information (See 18
        U.S.C. 1001).
      </p>

      <div aria-describedby="nursing-home-statements-declaration">
        <VaStatementOfTruth
          name="nursing-home-official-signature"
          heading="Statement of Truth"
          inputLabel="Your full name"
          inputValue={signature.value}
          inputError={inputError}
          checked={signature.checked}
          checkboxLabel="I certify the information above is correct and true to the best of my knowledge and belief."
          checkboxError={checkboxError}
          onVaInputChange={handleInputChange}
          onVaInputBlur={handleInputBlur}
          onVaCheckboxChange={handleCheckboxChange}
          hideLegalNote
        >
          I, {officialsName}, confirm that the identifying information in this
          form is accurate and has been represented correctly.
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
