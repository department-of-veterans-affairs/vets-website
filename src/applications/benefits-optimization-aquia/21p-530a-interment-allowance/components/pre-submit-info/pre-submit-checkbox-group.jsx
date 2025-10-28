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
  dirty: false,
  matches: false,
  value: '',
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

  // Get the official's title from form data (for display purposes)
  const officialTitle =
    formData?.officialSignature?.officialTitle || 'State or Tribal Official';

  // Set form data with signature values, if submission has not occurred
  useEffect(
    () => {
      if (hasSubmittedForm) return;

      const officialSignature =
        signatures['State or Tribal Official']?.value?.trim() || '';
      dispatch(
        setData({
          ...formData,
          stateTribalOfficialSignature: officialSignature,
        }),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, signatures],
  );

  // Validate signature text is valid and checkbox is checked
  useEffect(
    () => {
      const officialSig = signatures['State or Tribal Official'];
      const isComplete = officialSig?.matches && officialSig?.checked;
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
      const { checked, dirty, matches, value } = signature;

      const hasCheckboxError = !hasSubmittedForm && !checked && showError;
      const hasInputError =
        !hasSubmittedForm &&
        ((dirty && !matches) || (!dirty && showError && !value));

      const veteranName =
        [
          formData?.veteranIdentification?.fullName?.first,
          formData?.veteranIdentification?.fullName?.middle,
          formData?.veteranIdentification?.fullName?.last,
        ]
          .filter(Boolean)
          .join(' ') || '[Veteran Name]';

      const cemeteryName =
        formData?.cemeteryInformation?.cemeteryName || '[Cemetery Name]';

      const recipientFullName =
        formData?.burialBenefitsRecipient?.recipientOrganizationName ||
        '[Recipient Name]';

      const statementText = [
        `I certify that ${veteranName} was buried in ${cemeteryName}, a State-owned Veterans Cemetery or Tribal Cemetery, without charge to the family.`,
        `I certify that this cemetery is reserved solely for eligible veterans and their dependents as specified in 38 U.S.C. § 2402.`,
        'I understand that providing false or fraudulent information may result in criminal prosecution under 18 U.S.C. §§ 287, 1001.',
        `The current interment allowance rate of $978 (as of October 1, 2024) will be paid to the organization specified in this application.`,
      ];

      return (
        <StatementOfTruthItem
          hasCheckboxError={hasCheckboxError}
          hasInputError={hasInputError}
          label={officialTitle}
          expectedName={recipientFullName}
          signature={signature}
          setSignatures={setSignatures}
          statementText={statementText}
        />
      );
    },
    [hasSubmittedForm, showError, signatures, formData, officialTitle],
  );

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <p
        id="interment-allowance-declaration"
        className="vads-u-margin-bottom--4"
      >
        Please review the information entered in this application. The state or
        tribal official must sign the section below to certify the information.
      </p>

      <div aria-describedby="interment-allowance-declaration">
        {statementOfTruth}
      </div>

      <p className="vads-u-margin-top--4 vads-u-margin-bottom--6">
        <strong>Note:</strong> This signature certifies all information provided
        in VA Form 21P-530a and serves as the official certification required
        for processing the interment allowance payment to your organization.
      </p>
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
