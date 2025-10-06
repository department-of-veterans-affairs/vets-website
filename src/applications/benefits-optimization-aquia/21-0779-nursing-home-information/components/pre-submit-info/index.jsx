import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import StatementOfTruthItem from './statement-of-truth-item';

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
 * Displays signature boxes for nursing home official to certify form information
 *
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {boolean} props.showError - Whether to show validation errors
 * @param {Function} props.onSectionComplete - Callback when section is complete
 * @returns {JSX.Element} PreSubmit signature component
 */
const PreSubmitCheckboxGroup = ({ formData, showError, onSectionComplete }) => {
  const submission = useSelector(state => state.form.submission);
  const hasSubmittedForm = Boolean(submission.status);

  // Initialize signatures state
  const [signatures, setSignatures] = useState({
    'Nursing Home Official': DEFAULT_SIGNATURE_STATE,
  });

  // Get the official's name from form data
  const officialName =
    formData?.officialInfoAndSignature?.officialName || 'Official';

  // Validate signature text is valid and checkbox is checked
  useEffect(
    () => {
      const officialSig = signatures['Nursing Home Official'];
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
        signatures['Nursing Home Official'] || DEFAULT_SIGNATURE_STATE;
      const { checked, dirty, matches, value } = signature;

      const hasCheckboxError = !hasSubmittedForm && !checked && showError;
      const hasInputError =
        !hasSubmittedForm &&
        ((dirty && !matches) || (!dirty && showError && !value));

      const statementText = [
        `I, ${officialName}, certify and declare under penalty of perjury under the laws of the United States of America that the information I have provided in this form is true and correct.`,
        'I understand that providing false or fraudulent information may result in criminal prosecution under 18 U.S.C. §§ 287, 1001.',
        'I certify that the veteran or claimant named in this form is currently a patient in this nursing home and is receiving the level of care indicated.',
      ];

      return (
        <StatementOfTruthItem
          fullName={officialName}
          hasCheckboxError={hasCheckboxError}
          hasInputError={hasInputError}
          label="Nursing Home Official"
          signature={signature}
          setSignatures={setSignatures}
          statementText={statementText}
        />
      );
    },
    [hasSubmittedForm, officialName, showError, signatures],
  );

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <va-alert status="warning" show-icon class="vads-u-margin-bottom--4">
        <h3 slot="headline">Certification required</h3>
        <p>
          This form must be certified by an authorized nursing home official. By
          signing below, you certify that all information provided in this form
          is accurate and complete.
        </p>
      </va-alert>

      <p
        id="nursing-home-statements-declaration"
        className="vads-u-margin-bottom--4"
      >
        Please review the information entered in this application. The nursing
        home official must sign the section below to certify the information.
      </p>

      <div aria-describedby="nursing-home-statements-declaration">
        {statementOfTruth}
      </div>

      <p className="vads-u-margin-top--4 vads-u-margin-bottom--6">
        <strong>Note:</strong> This signature certifies all information provided
        in VA Form 21-0779 and serves as the official certification required for
        processing Aid and Attendance benefits.
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
