import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { StatementOfTruthItem } from './statement-of-truth-item';

/**
 * Default signature state for new signatures
 */
const DEFAULT_SIGNATURE_STATE = {
  checked: false,
  signatureDirty: false,
  signatureValue: '',
  titleDirty: false,
  titleValue: '',
};

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

  // Initialize signatures state
  const [signatures, setSignatures] = useState({
    'State or Tribal Official': DEFAULT_SIGNATURE_STATE,
  });

  // Set form data with signature and title values, if submission has not occurred
  useEffect(
    () => {
      if (hasSubmittedForm) return;

      const officialSignature =
        signatures['State or Tribal Official']?.signatureValue?.trim() || '';
      const officialTitle =
        signatures['State or Tribal Official']?.titleValue?.trim() || '';
      dispatch(
        setData({
          ...formData,
          certification: {
            signature: officialSignature,
            titleOfStateOrTribalOfficial: officialTitle,
          },
        }),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, signatures],
  );

  // Validate signature, title, and checkbox are all complete
  useEffect(
    () => {
      const officialSig = signatures['State or Tribal Official'];
      const hasSignature = officialSig?.signatureValue?.trim().length > 0;
      const hasTitle =
        officialSig?.titleValue?.trim().length >= 2 &&
        officialSig?.titleValue?.trim().length <= 100;
      const isChecked = officialSig?.checked;
      const isComplete = hasSignature && hasTitle && isChecked;
      onSectionComplete(isComplete);
      return () => onSectionComplete(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signatures],
  );

  const statementOfTruth = useMemo(
    () => {
      const signature =
        signatures['State or Tribal Official'] || DEFAULT_SIGNATURE_STATE;
      const {
        checked,
        signatureDirty,
        signatureValue,
        titleDirty,
        titleValue,
      } = signature;

      // Only show errors if form hasn't been submitted
      if (hasSubmittedForm) {
        return (
          <StatementOfTruthItem
            hasCheckboxError={false}
            hasSignatureError={false}
            hasTitleError={false}
            label="State or Tribal Official"
            signature={signature}
            setSignatures={setSignatures}
          />
        );
      }

      // Checkbox validation
      const hasCheckboxError = !checked && showError;

      // Signature validation: show error if field is dirty or form submission attempted
      const signatureIsEmpty = !signatureValue?.trim();
      const hasSignatureError =
        signatureIsEmpty && (signatureDirty || showError);

      // Title validation: check length constraints
      const titleLength = titleValue?.trim().length || 0;
      const titleIsInvalid = titleLength < 2 || titleLength > 100;
      const hasTitleError = titleIsInvalid && (titleDirty || showError);

      return (
        <StatementOfTruthItem
          hasCheckboxError={hasCheckboxError}
          hasSignatureError={hasSignatureError}
          hasTitleError={hasTitleError}
          label="State or Tribal Official"
          signature={signature}
          setSignatures={setSignatures}
        />
      );
    },
    [hasSubmittedForm, showError, signatures],
  );
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <p className="vads-u-margin-bottom--4">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or for providing incorrect information (See 18
        U.S.C. 1001).
      </p>

      <div aria-describedby="interment-allowance-declaration">
        {statementOfTruth}
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
