import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setPreSubmit } from 'platform/forms-system/src/js/actions';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fullNameReducer,
  statementOfTruthFullName,
} from '~/platform/forms/components/review/PreSubmitSection';

export default function PresubmitInfo({
  formData,
  showError,
  user,
  onSectionComplete,
}) {
  // local state
  const [signatureBlurred, setSignatureBlurred] = useState(false);
  const [inputError, setInputError] = useState(null);
  const [checkboxError, setCheckboxError] = useState(null);
  const [sectionComplete, setSectionComplete] = useState(false);
  const dispatch = useDispatch();
  const expectedFullName = statementOfTruthFullName(
    formData,
    {
      useProfileFullName: true,
    },
    user?.profile?.userFullName,
  );

  // event handlers
  const handleCheckboxChange = useCallback(
    event => {
      dispatch(setPreSubmit('statementOfTruthCertified', event.detail.checked));
    },
    [dispatch],
  );

  const handleInputChange = useCallback(
    event => {
      dispatch(setPreSubmit('statementOfTruthSignature', event.detail.value));
    },
    [dispatch],
  );

  const handleInputBlur = useCallback(
    () => setSignatureBlurred(true),
    [setSignatureBlurred],
  );

  // effects: need to update formData and errors based on what the user
  // has typed and if they've checked the checkbox
  useEffect(() => {
    // check for name-matching error
    const namesMatch =
      fullNameReducer(formData.statementOfTruthSignature) ===
      fullNameReducer(expectedFullName);
    setInputError(
      (showError || signatureBlurred) && !namesMatch
        ? `Enter your name exactly as it appears on your form: ${expectedFullName}`
        : null,
    );

    // check for checkbox error
    setCheckboxError(
      showError && !formData.statementOfTruthCertified
        ? 'You must certify by checking the box'
        : null,
    );

    const isComplete = namesMatch && formData.statementOfTruthCertified;
    if (sectionComplete !== isComplete) {
      setSectionComplete(isComplete);
      onSectionComplete(isComplete);
    }
  }, [
    formData.statementOfTruthSignature,
    formData.statementOfTruthCertified,
    showError,
    signatureBlurred,
    onSectionComplete,
    expectedFullName,
    sectionComplete,
  ]);

  return (
    <VaStatementOfTruth
      hideLegalNote
      heading="Certification statement"
      inputLabel="Your full name"
      inputValue={formData.statementOfTruthSignature}
      checked={formData.statementOfTruthCertified}
      inputMessageAriaDescribedby="I have read and accept the privacy policy."
      onVaInputChange={handleInputChange}
      onVaInputBlur={handleInputBlur}
      onVaCheckboxChange={handleCheckboxChange}
      inputError={inputError}
      checkboxError={checkboxError}
    >
      <div>
        <p>
          <strong>Penalty:</strong> Willfully false statements as to a material
          fact in a claim for education benefits payable by VA may result in a
          fine, imprisonment, or both.
        </p>
      </div>
    </VaStatementOfTruth>
  );
}

PresubmitInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
  preSubmitInfo: PropTypes.shape({
    error: PropTypes.string,
    statementOfTruth: PropTypes.shape({
      heading: PropTypes.string,
      textInputLabel: PropTypes.string,
      messageAriaDescribedby: PropTypes.string,
      body: PropTypes.string,
    }),
  }),
  showError: PropTypes.bool,
  user: PropTypes.shape({
    login: PropTypes.shape({
      currentlyLoggedIn: PropTypes.bool,
    }),
    profile: PropTypes.shape({
      userFullName: PropTypes.object,
    }),
  }),
};
