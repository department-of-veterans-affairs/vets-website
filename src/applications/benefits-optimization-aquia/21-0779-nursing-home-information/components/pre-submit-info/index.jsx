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

  const { nursingOfficialInformation = {} } = formData;

  // Get the official's name from form data
  const officialName = `${nursingOfficialInformation?.firstName ||
    ''} ${nursingOfficialInformation?.lastName || ''}`.trim();

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
        `I, ${officialName}, confirm that the identifying information in this form is accurate and has been represented correctly.`,
      ];

      const federalLawNote = (
        <p>
          <strong>Note:</strong> According to federal law, there are criminal
          penalties, including a fine and/or imprisonment for up to 5 years, for
          withholding information or for providing incorrect information (See 18
          U.S.C. 1001).
        </p>
      );

      return (
        <StatementOfTruthItem
          hasCheckboxError={hasCheckboxError}
          hasInputError={hasInputError}
          label="Nursing Home Official"
          signature={signature}
          setSignatures={setSignatures}
          statementText={statementText}
          additionalChildComponent={federalLawNote}
        />
      );
    },
    [hasSubmittedForm, officialName, showError, signatures],
  );

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
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
