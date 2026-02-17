import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { TextInputField } from '@bio-aquia/shared/components/atoms';

const ERROR_MSG_CHECKBOX = 'You must certify this statement is correct';
const FULL_NAME_MIN_LENGTH = 3;
const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 100;

/**
 * Validates that a string length is within the allowed range after trimming
 * @param {string} value - The value to validate
 * @param {number} minLength - Minimum required length
 * @param {number} [maxLength] - Maximum allowed length
 * @returns {boolean} True if valid
 */
const isValidLength = (value, minLength, maxLength) => {
  const length = value?.trim()?.length || 0;
  if (length < minLength) return false;
  if (maxLength && length > maxLength) return false;
  return true;
};

/**
 * PreSubmitInfo component for VA Form 21-2680
 * Displays the federal law note and statement of truth with
 * full name, title, and certification checkbox.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.showError - Whether to show validation errors
 * @param {Function} props.onSectionComplete - Callback when section is complete
 */
export const PreSubmitInfo = ({ showError, onSectionComplete }) => {
  const formData = useSelector(state => state.form.data);
  const submission = useSelector(state => state.form.submission);
  const dispatch = useDispatch();
  const hasSubmittedForm = Boolean(submission.status);
  const prevCompleteRef = useRef(null);
  const lastDispatchedData = useRef(null);

  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [isCertified, setIsCertified] = useState(false);
  const [fullNameTouched, setFullNameTouched] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);

  // Sync certification data to Redux form state
  useEffect(
    () => {
      if (hasSubmittedForm) return;

      const certificationData = {
        signature: fullName.trim(),
        title: title.trim(),
        certified: isCertified,
      };

      const dataKey = JSON.stringify(certificationData);
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
    [dispatch, fullName, title, isCertified, hasSubmittedForm, formData],
  );

  // Notify parent of completion status
  useEffect(
    () => {
      const isComplete =
        isValidLength(fullName, FULL_NAME_MIN_LENGTH) &&
        isValidLength(title, TITLE_MIN_LENGTH, TITLE_MAX_LENGTH) &&
        isCertified;

      if (!hasSubmittedForm && prevCompleteRef.current !== isComplete) {
        prevCompleteRef.current = isComplete;
        onSectionComplete(isComplete);
      }
    },
    [fullName, title, isCertified, hasSubmittedForm, onSectionComplete],
  );

  // Error state
  const shouldShowFullNameError =
    !hasSubmittedForm && (fullNameTouched || showError);
  const shouldShowTitleError = !hasSubmittedForm && (titleTouched || showError);
  const shouldShowCheckboxError = !hasSubmittedForm && showError;

  const fullNameError =
    shouldShowFullNameError && !isValidLength(fullName, FULL_NAME_MIN_LENGTH)
      ? 'Enter your full name'
      : null;

  let titleError = null;
  if (shouldShowTitleError) {
    if (!isValidLength(title, TITLE_MIN_LENGTH)) {
      titleError = 'Enter your title';
    } else if (title.trim().length > TITLE_MAX_LENGTH) {
      titleError = `Title must be ${TITLE_MAX_LENGTH} characters or fewer`;
    }
  }

  const checkboxError =
    shouldShowCheckboxError && !isCertified ? ERROR_MSG_CHECKBOX : null;

  // Event handlers
  const handleFullNameChange = useCallback(event => {
    setFullName(event.detail.value);
  }, []);

  const handleFullNameBlur = useCallback(() => {
    setFullNameTouched(true);
  }, []);

  const handleTitleChange = useCallback((_, value) => {
    setTitle(value);
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
        withholding information or for providing incorrect information
        (Reference: 18 U.S.C. 1001).
      </p>

      <VaStatementOfTruth
        name="examiner-signature"
        heading="Statement of truth"
        inputLabel="Your full name"
        inputValue={fullName}
        inputError={fullNameError}
        checked={isCertified}
        checkboxLabel="I certify that the information above is correct and true to the best of my knowledge and belief."
        checkboxError={checkboxError}
        onVaInputChange={handleFullNameChange}
        onVaInputBlur={handleFullNameBlur}
        onVaCheckboxChange={handleCheckboxChange}
        hideLegalNote
      >
        <p>
          I confirm that the identifying information in this form is accurate
          and has been represented correctly.
        </p>
        <TextInputField
          name="examinerTitle"
          label="Your title"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          required
          error={titleError}
          maxLength={TITLE_MAX_LENGTH}
          forceShowError={
            shouldShowTitleError &&
            !isValidLength(title, TITLE_MIN_LENGTH, TITLE_MAX_LENGTH)
          }
        />
      </VaStatementOfTruth>
    </div>
  );
};

PreSubmitInfo.propTypes = {
  showError: PropTypes.bool.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
};

export default {
  required: true,
  CustomComponent: PreSubmitInfo,
};
