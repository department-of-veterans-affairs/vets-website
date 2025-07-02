import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import StatementOfTruth from './StatementOfTruth';
import SignatureCheckbox from './SignatureCheckbox';
import ProtectionOfPrivacyStatement from './ProtectionOfPrivacyStatement';

const PreSubmit = ({ formData, showError, onSectionComplete }) => {
  const submission = useSelector(state => state.form.submission);
  const hasSubmittedForm = !!submission.status;

  // Initialize state for the Statement of Truth section
  const [isStatementOfTruthSigned, setIsStatementOfTruthSigned] = useState(
    null,
  );
  const [
    isStatementOfTruthCertified,
    setIsStatementOfTruthCertified,
  ] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const privacyStatement = useMemo(
    () => {
      return (
        <ProtectionOfPrivacyStatement
          formData={formData}
          hasSubmittedForm={hasSubmittedForm}
          isChecked={isChecked}
          onSectionComplete={onSectionComplete}
          setIsChecked={setIsChecked}
          showError={showError}
        />
      );
    },
    [
      formData,
      hasSubmittedForm,
      isChecked,
      onSectionComplete,
      setIsChecked,
      showError,
    ],
  );

  // Mark the review page as complete when the Statement of Truth and Privacy Agreement are both complete
  useEffect(
    () => {
      if (
        isChecked &&
        isStatementOfTruthCertified &&
        isStatementOfTruthSigned
      ) {
        onSectionComplete(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isChecked, isStatementOfTruthCertified, isStatementOfTruthSigned],
  );

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      {privacyStatement}
      <SignatureCheckbox
        fullName={formData.fullName}
        showError={showError}
        submission={submission}
        isStatementOfTruthSigned={isStatementOfTruthSigned}
        setIsStatementOfTruthSigned={setIsStatementOfTruthSigned}
        setIsStatementOfTruthCertified={setIsStatementOfTruthCertified}
        isRequired
      >
        <StatementOfTruth />
      </SignatureCheckbox>
      <p className="vads-u-margin-bottom--3">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or providing incorrect information. (See 18
        U.S.C. 1001)
      </p>
    </div>
  );
};

PreSubmit.propTypes = {
  formData: PropTypes.object.isRequired,
  showError: PropTypes.bool.isRequired,
  onSectionComplete: PropTypes.func.isRequired,
};

export default {
  required: true,
  CustomComponent: PreSubmit,
};
