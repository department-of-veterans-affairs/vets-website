import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { TextInputField } from '@bio-aquia/shared/components/atoms';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ERROR_MSG_CHECKBOX = 'You must certify this statement is correct';

const TITLE_MIN_LENGTH = 2;
const TITLE_MAX_LENGTH = 100;

/**
 * PreSubmitCheckboxGroup component
 * Displays signature boxes for state/tribal official to certify form information
 *
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {boolean} props.showError - Whether to show validation errors
 * @param {Function} props.onSectionComplete - Callback when section is complete
 * @returns {JSX.Element} PreSubmit signature component
 */
export const PreSubmitCheckboxGroup = ({
  formData,
  showError,
  onSectionComplete,
}) => {
  const { burialInformation = {} } = formData;

  // Organization name for title field (state/tribal cemetery organization)
  const titleOrganizationName =
    burialInformation?.nameOfStateCemeteryOrTribalOrganization || '';

  // Organization name for full name field (recipient organization)
  const recipientOrganizationName =
    burialInformation?.recipientOrganization?.name || '';

  const submission = useSelector(state => state.form.submission);
  const dispatch = useDispatch();
  const hasSubmittedForm = Boolean(submission.status);

  // State for the single signature required
  const [fullName, setFullName] = useState('');
  const [organizationTitle, setOrganizationTitle] = useState('');
  const [isCertified, setIsCertified] = useState(false);
  const [fullNameTouched, setFullNameTouched] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);

  // Normalize string for comparison: lowercase and remove all spaces
  const normalizeForComparison = useCallback(str => {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase().replace(/\s+/g, '');
  }, []);

  // Validate full name matches recipient organization name
  const validateFullName = useCallback(
    () => {
      if (!recipientOrganizationName) {
        return fullName.trim().length > 0;
      }
      return (
        normalizeForComparison(fullName) ===
        normalizeForComparison(recipientOrganizationName)
      );
    },
    [fullName, recipientOrganizationName, normalizeForComparison],
  );

  // Validate title matches state/tribal organization name
  const validateTitle = useCallback(
    () => {
      if (!titleOrganizationName) {
        const titleLength = organizationTitle.trim().length;
        return (
          titleLength >= TITLE_MIN_LENGTH && titleLength <= TITLE_MAX_LENGTH
        );
      }
      return (
        normalizeForComparison(organizationTitle) ===
        normalizeForComparison(titleOrganizationName)
      );
    },
    [organizationTitle, titleOrganizationName, normalizeForComparison],
  );

  // Sync form data with certification values
  useEffect(
    () => {
      if (hasSubmittedForm) return;

      dispatch(
        setData({
          ...formData,
          certification: {
            signature: fullName.trim(),
            titleOfStateOrTribalOfficial: organizationTitle.trim(),
            certified: isCertified,
          },
        }),
      );
    },
    [
      dispatch,
      fullName,
      organizationTitle,
      isCertified,
      hasSubmittedForm,
      formData,
    ],
  );

  // Check if all required fields are valid
  useEffect(
    () => {
      const hasValidFullName = validateFullName();
      const hasValidTitle = validateTitle();
      const isComplete = hasValidFullName && hasValidTitle && isCertified;

      onSectionComplete(isComplete);
      return () => onSectionComplete(false);
    },
    [
      fullName,
      organizationTitle,
      isCertified,
      recipientOrganizationName,
      titleOrganizationName,
      validateFullName,
      validateTitle,
      onSectionComplete,
    ],
  );

  // Determine if errors should be shown
  const shouldShowErrors = !hasSubmittedForm && showError;
  const shouldShowFullNameError =
    !hasSubmittedForm && (fullNameTouched || showError);
  const shouldShowTitleError = !hasSubmittedForm && (titleTouched || showError);

  // Validation checks
  const isFullNameEmpty = fullName.trim().length === 0;
  const isFullNameValid = validateFullName();
  const isTitleEmpty = organizationTitle.trim().length === 0;
  const isTitleValid = validateTitle();

  // Error messages (null if no error)
  let fullNameError = null;
  if (shouldShowFullNameError) {
    if (isFullNameEmpty) {
      fullNameError = `Enter your full name as the state or tribal official representing ${recipientOrganizationName ||
        'the organization'}`;
    } else if (!isFullNameValid && recipientOrganizationName) {
      fullNameError = `Your signature must match: ${recipientOrganizationName}`;
    }
  }

  let titleErrorMsg = null;
  if (shouldShowTitleError) {
    if (isTitleEmpty) {
      titleErrorMsg = `Enter your title at ${titleOrganizationName ||
        'the organization'}`;
    } else if (!isTitleValid && titleOrganizationName) {
      titleErrorMsg = `Your title must match: ${titleOrganizationName}`;
    }
  }

  const checkboxError =
    shouldShowErrors && !isCertified ? ERROR_MSG_CHECKBOX : null;

  // Event handlers
  const handleFullNameChange = useCallback(event => {
    setFullName(event.detail.value);
  }, []);

  const handleFullNameBlur = useCallback(() => {
    setFullNameTouched(true);
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
          heading="Statement of truth"
          inputLabel="Your full name"
          inputValue={fullName}
          inputError={fullNameError}
          checked={isCertified}
          checkboxLabel="I certify the information above is correct and true to the best of my knowledge and belief."
          checkboxError={checkboxError}
          onVaInputBlur={handleFullNameBlur}
          onVaInputChange={handleFullNameChange}
          onVaCheckboxChange={handleCheckboxChange}
          hideLegalNote
        >
          I confirm that the identifying information in this form is accurate
          and has been represented correctly.
          <TextInputField
            name="organizationTitle"
            label="Your organization title"
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
  formData: PropTypes.object.isRequired,
  showError: PropTypes.bool.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
};

export default {
  required: true,
  CustomComponent: PreSubmitCheckboxGroup,
};
