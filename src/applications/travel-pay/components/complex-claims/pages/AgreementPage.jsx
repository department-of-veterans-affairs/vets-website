import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import {
  VaCheckbox,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import TravelAgreementContent from '../../TravelAgreementContent';

const AgreementPage = () => {
  const navigate = useNavigate();
  const { apptId, claimId } = useParams();
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [isAgreementError, setIsAgreementError] = useState(false);
  const onSubmit = () => {
    if (!isAgreementChecked) {
      setIsAgreementError(true);
    } else {
      setIsAgreementError(false);
      // TODO Add logic for Submitting the claim
      navigate(`/file-new-claim/${apptId}/${claimId}/confirmation`);
    }
  };

  const onBack = () => {
    navigate(`/file-new-claim/${apptId}/${claimId}/review`);
  };

  return (
    <>
      <h1>Beneficiary travel agreement</h1>
      <p className="vads-u-font-weight--bold vads-u-font-family--sans vads-u-display--inline">
        Penalty statement:
      </p>{' '}
      <p className="vads-u-display--inline">
        There are severe criminal and civil penalties, including a fine,
        imprisonment, or both, for knowingly submitting a false, fictitious, or
        fraudulent claim.
      </p>
      <p>
        By submitting this claim, you agree to the beneficiary travel agreement.
      </p>
      <TravelAgreementContent />
      <VaCheckbox
        data-testid="agreement-checkbox"
        className="vads-u-margin-x--1 vads-u-margin-y--2"
        checked={isAgreementChecked}
        name="accept-agreement"
        description={null}
        error={
          isAgreementError
            ? 'You must accept the beneficiary travel agreement before continuing.'
            : null
        }
        hint={null}
        label="I confirm that the information is true and correct to the best of my knowledge and belief. I’ve read and I accept the beneficiary travel agreement."
        onVaChange={() => setIsAgreementChecked(!isAgreementChecked)}
        required
      />
      <VaButtonPair
        data-testid="agreement-button-pair"
        className="vads-u-margin-top--2"
        continue
        disable-analytics
        rightButtonText="Submit claim"
        leftButtonText="Back"
        onPrimaryClick={onSubmit}
        onSecondaryClick={onBack}
      />
    </>
  );
};

export default AgreementPage;
