import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import StatementOfTruth from './StatementOfTruth';
import SignatureCheckbox from './SignatureCheckbox';
import ProtectionOfPrivacyStatement from './ProtectionOfPrivacyStatement';


const PreSubmitCheckboxGroup = ({ formData, showError, onSectionComplete }) => {
  const submission = useSelector(state => state.form.submission);
  const hasSubmittedForm = !!submission.status;
  const dispatch = useDispatch();
  const [signatureComplete, setSignatureComplete] = useState(false);
  const [signature1, setSignature1] = useState(null);
  const [signature1Checked, setSignature1Checked] = useState(false);


  // set form data with signature value, if submission has not occurred
  useEffect(
    () => {
      if (submission.status) return;
      dispatch(setData({ ...formData, ...{ signature1: signature1 } }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, signature1],
  );

  // validate that the signature text is valid and its checkbox has been checked
  useEffect(
    () => {
      console.log('signature1:', signature1);
      console.log('formData.veteranFullName:', formData.veteranFullName);
      console.log('signature1Checked:', signature1Checked);
      const isComplete = signature1 && signature1Checked;
      console.log('isComplete:', isComplete);
      setSignatureComplete(isComplete);
      return () => onSectionComplete(false);
    },
    [signature1, signature1Checked],
  );

  const statementsOfTruth = useMemo(() => {
      return (
        <SignatureCheckbox
          fullName={formData.veteranFullName}
          showError={showError}
          submission={submission}
          signature1={signature1}
          setSignature1={setSignature1}
          setSignature1Checked={setSignature1Checked}
          isRequired
        >
          <StatementOfTruth />
        </SignatureCheckbox>
      );
    }, [showError, setSignature1],
  );

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
    [isChecked, setIsChecked, showError],
  );

  // Mark the review page as complete when the Statement of Truth and Privacy Agreement are both complete
  useEffect(
    () => {
      if (signatureComplete && isChecked) {
        onSectionComplete(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isChecked, signatureComplete],
  );

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      {privacyStatement}
      {statementsOfTruth}
      <p className="vads-u-margin-bottom--3">
        <strong>Note:</strong> According to federal law, there are criminal
        penalties, including a fine and/or imprisonment for up to 5 years, for
        withholding information or providing incorrect information. (See 18
        U.S.C. 1001)
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
