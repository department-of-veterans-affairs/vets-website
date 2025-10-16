import React, { useState } from 'react';

import {
  VaCheckbox,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import TravelAgreementContent from '../../TravelAgreementContent';

const AgreementPage = () => {
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [isAgreementError, setIsAgreementError] = useState(false);
  const onSubmit = () => {
    if (!isAgreementChecked) {
      setIsAgreementError(true);
      // TODO Add logic for Submitting the claim
    }
  };
  const onBack = () => {
    // TODO Add logic to go to previous Review Page
  };
  return (
    <>
      <h1>Beneficiary travel agreement - test</h1>
      <h4 className="vads-u-font-family--sans vads-u-display--inline">
        Penalty statement:
      </h4>{' '}
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
