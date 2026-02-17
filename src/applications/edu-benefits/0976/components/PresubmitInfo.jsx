import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaStatementOfTruth } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fullNameReducer,
  statementOfTruthFullName,
} from '~/platform/forms/components/review/PreSubmitSection';
import { setPreSubmit as setPreSubmitAction } from 'platform/forms-system/src/js/actions';

function PresubmitInfo({
  formData,
  showError,
  setPreSubmit,
  onSectionComplete,
}) {
  // local state
  const [signatureBlurred, setSignatureBlurred] = useState(false);
  const [inputError, setInputError] = useState(null);
  const [checkboxError, setCheckboxError] = useState(null);
  const [sectionComplete, setSectionComplete] = useState(false);
  const expectedFullName = statementOfTruthFullName(
    formData,
    {
      fullNamePath: 'authorizingOfficial.fullName',
    },
    null,
  );

  // event handlers
  const handleCheckboxChange = useCallback(
    event => {
      setPreSubmit('statementOfTruthCertified', event.detail.checked);
    },
    [setPreSubmit],
  );

  const handleInputChange = useCallback(
    event => {
      setPreSubmit('statementOfTruthSignature', event.detail.value);
    },
    [setPreSubmit],
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
        ? `Please enter your name exactly as it appears on your application: ${expectedFullName}`
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
          The information you provide in this application will help us determine
          if your application is accepted for the approval of a program ina
          foreign country.
        </p>
      </div>
    </VaStatementOfTruth>
  );
}

PresubmitInfo.propTypes = {
  formData: PropTypes.object.isRequired,
  setPreSubmit: PropTypes.func.isRequired,
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

const mapDispatchToProps = {
  setPreSubmit: setPreSubmitAction,
};

export { PresubmitInfo as BasePresubmitInfo };

export default connect(null, mapDispatchToProps)(PresubmitInfo);
