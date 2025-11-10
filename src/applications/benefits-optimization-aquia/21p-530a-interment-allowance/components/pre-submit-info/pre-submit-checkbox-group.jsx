import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { TextInputField } from '@bio-aquia/shared/components/atoms';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ERROR_MSG_CHECKBOX = 'You must certify this statement is correct';
const ERROR_MSG_SIGNATURE = 'Please enter your full name';
const ERROR_MSG_TITLE = 'Please enter an organization title';

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
  const submission = useSelector(state => state.form.submission);
  const dispatch = useDispatch();
  const hasSubmittedForm = Boolean(submission.status);

  // State for the single signature required
  const [fullName, setFullName] = useState('');
  const [organizationTitle, setOrganizationTitle] = useState('');
  const [isCertified, setIsCertified] = useState(false);
  const [fullNameTouched, setFullNameTouched] = useState(false);
  const [titleTouched, setTitleTouched] = useState(false);

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
          },
        }),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, fullName, organizationTitle],
  );

  // Check if all required fields are valid
  useEffect(
    () => {
      const hasValidFullName = fullName.trim().length > 0;
      const titleLength = organizationTitle.trim().length;
      const hasValidTitle =
        titleLength >= TITLE_MIN_LENGTH && titleLength <= TITLE_MAX_LENGTH;
      const isComplete = hasValidFullName && hasValidTitle && isCertified;

      onSectionComplete(isComplete);
      return () => onSectionComplete(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fullName, organizationTitle, isCertified],
  );

  // Determine if errors should be shown
  const shouldShowErrors = !hasSubmittedForm && showError;
  const shouldShowFullNameError =
    !hasSubmittedForm && (fullNameTouched || showError);
  const shouldShowTitleError = !hasSubmittedForm && (titleTouched || showError);

  // Validation checks
  const isFullNameEmpty = fullName.trim().length === 0;
  const titleLength = organizationTitle.trim().length;
  const isTitleInvalid =
    titleLength < TITLE_MIN_LENGTH || titleLength > TITLE_MAX_LENGTH;

  // Error messages (null if no error)
  const fullNameError =
    shouldShowFullNameError && isFullNameEmpty ? ERROR_MSG_SIGNATURE : null;
  const titleError =
    shouldShowTitleError && isTitleInvalid ? ERROR_MSG_TITLE : null;
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
            error={titleError}
            forceShowError={shouldShowTitleError && isTitleInvalid}
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
