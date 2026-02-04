import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { TextInputField } from '@bio-aquia/shared/components/atoms';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getVeteranName } from '@bio-aquia/21p-530a-interment-allowance/utils/actions/name-helpers';

const ERROR_MSG_CHECKBOX = 'You must certify this statement is correct';

const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 100;
const FULL_NAME_MIN_LENGTH = 3;

/**
 * Validates signature input
 * Requires at least 3 non-whitespace characters
 *
 * @param {string} signatureValue - The signature input value
 * @returns {boolean} - True if valid, false otherwise
 */
export const isSignatureValid = signatureValue => {
  if (!signatureValue) return false;

  const trimmed = signatureValue.trim();
  return trimmed.length >= FULL_NAME_MIN_LENGTH;
};

/**
 * PreSubmitCheckboxGroup component
 * Displays signature boxes for state/tribal official to certify form information
 *
 * @param {Object} props - Component props
 * @param {boolean} props.showError - Whether to show validation errors
 * @param {Function} props.onSectionComplete - Callback when section is complete
 * @returns {JSX.Element} PreSubmit signature component
 */
export const PreSubmitCheckboxGroup = ({ showError, onSectionComplete }) => {
  // Get formData from Redux instead of props to avoid infinite loop in useEffect
  const formData = useSelector(state => state.form.data);
  const veteranName = getVeteranName(formData);
  const submission = useSelector(state => state.form.submission);
  const dispatch = useDispatch();
  const hasSubmittedForm = Boolean(submission.status);

  // State for the single signature required
  const [signatoryFullName, setSignatoryFullName] = useState('');
  const [organizationTitle, setOrganizationTitle] = useState('');
  const [isCertified, setIsCertified] = useState(false);
  const [signatoryFullNameTouched, setSignatoryFullNameTouched] = useState(
    false,
  );
  const [titleTouched, setTitleTouched] = useState(false);

  // Ref to prevent duplicate dispatches
  const lastDispatchedData = useRef(null);

  // Ref to track previous completion state (prevents unnecessary onSectionComplete calls)
  const prevCompleteRef = useRef(null);

  // Validate full name using shared validation logic
  const validateSignatoryFullName = useCallback(
    () => {
      return isSignatureValid(signatoryFullName);
    },
    [signatoryFullName],
  );

  // Validate title meets length requirements
  const validateTitle = useCallback(
    () => {
      const titleLength = organizationTitle.trim().length;
      return titleLength >= TITLE_MIN_LENGTH && titleLength <= TITLE_MAX_LENGTH;
    },
    [organizationTitle],
  );

  // Sync form data with certification values
  useEffect(
    () => {
      if (hasSubmittedForm) return;

      const certificationData = {
        signature: signatoryFullName.trim(),
        titleOfStateOrTribalOfficial: organizationTitle.trim(),
        certified: isCertified,
      };

      // Create a stable comparison key to prevent unnecessary dispatches
      const dataKey = JSON.stringify(certificationData);

      // Only dispatch if data has actually changed
      // The ref comparison prevents infinite loops even though formData is in deps
      if (lastDispatchedData.current !== dataKey) {
        lastDispatchedData.current = dataKey;

        dispatch(
          setData({
            ...formData,
            AGREED: isCertified,
            certification: certificationData,
          }),
        );
      }
    },
    [
      dispatch,
      signatoryFullName,
      organizationTitle,
      isCertified,
      hasSubmittedForm,
      formData,
    ],
  );

  // Check if all required fields are valid and notify parent when completion state changes
  useEffect(
    () => {
      const hasValidSignatoryFullName = validateSignatoryFullName();
      const hasValidTitle = validateTitle();
      const isComplete =
        hasValidSignatoryFullName && hasValidTitle && isCertified;

      // Only call callback if completion state has actually changed
      // This prevents unnecessary calls even if parent passes new callback reference
      if (!hasSubmittedForm && prevCompleteRef.current !== isComplete) {
        prevCompleteRef.current = isComplete;
        onSectionComplete(isComplete);
      }
    },
    [
      signatoryFullName,
      organizationTitle,
      isCertified,
      validateSignatoryFullName,
      validateTitle,
      hasSubmittedForm,
      onSectionComplete,
    ],
  );

  // Determine if errors should be shown
  const shouldShowErrors = !hasSubmittedForm && showError;
  const shouldShowSignatoryFullNameError =
    !hasSubmittedForm && (signatoryFullNameTouched || showError);
  const shouldShowTitleError = !hasSubmittedForm && (titleTouched || showError);

  // Validation checks
  const isSignatoryFullNameValid = validateSignatoryFullName();
  const isTitleEmpty = organizationTitle.trim().length === 0;
  const isTitleValid = validateTitle();

  // Error messages (null if no error)
  let signatoryFullNameError = null;
  if (shouldShowSignatoryFullNameError && !isSignatoryFullNameValid) {
    signatoryFullNameError = 'Enter your full name';
  }

  let titleErrorMsg = null;
  if (shouldShowTitleError && isTitleEmpty) {
    titleErrorMsg = 'Enter your title';
  }

  const checkboxError =
    shouldShowErrors && !isCertified ? ERROR_MSG_CHECKBOX : null;

  // Event handlers
  const handleSignatoryFullNameChange = useCallback(event => {
    setSignatoryFullName(event.detail.value);
  }, []);

  const handleSignatoryFullNameBlur = useCallback(() => {
    setSignatoryFullNameTouched(true);
  }, []);

  const handleTitleChange = useCallback((_, value) => {
    setOrganizationTitle(value);
  }, []);

  const handleTitleBlur = useCallback(() => {
    setTitleTouched(true);
  }, []);

  const handleCheckboxChange = useCallback(event => {
    setIsCertified(event.detail.checked);
  }, []);
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <p className="vads-u-margin-bottom--4">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information (See 18
        U.S.C. 1001).
      </p>

      <div aria-describedby="interment-allowance-declaration">
        <VaStatementOfTruth
          name="stateOrTribalOfficial"
          heading="Certification and signature"
          inputLabel="Your full name"
          inputValue={signatoryFullName}
          inputError={signatoryFullNameError}
          checked={isCertified}
          checkboxLabel={`I hereby certify that ${veteranName} was buried in a State-owned Veterans Cemetery or Tribal Cemetery (without charge).`}
          checkboxError={checkboxError}
          onVaInputBlur={handleSignatoryFullNameBlur}
          onVaInputChange={handleSignatoryFullNameChange}
          onVaCheckboxChange={handleCheckboxChange}
          hideLegalNote
        >
          <TextInputField
            name="organizationTitle"
            label="Your official title"
            value={organizationTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            required
            error={titleErrorMsg}
            forceShowError={shouldShowTitleError && !isTitleValid}
            minLength={TITLE_MIN_LENGTH}
            maxLength={TITLE_MAX_LENGTH}
          />
        </VaStatementOfTruth>
      </div>
    </div>
  );
};

PreSubmitCheckboxGroup.propTypes = {
  showError: PropTypes.bool.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
};

export default {
  required: true,
  CustomComponent: PreSubmitCheckboxGroup,
};
