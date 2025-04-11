import React, { useState, useEffect } from 'react';

const gaBankInfoHelpText = () => {
  window.dataLayer.push({
    event: 'edu-5490--form-help-text-clicked',
    'help-text-label': 'What if I don’t have a bank account?',
  });
};
const useCheckPath = () => {
  const [isEligibleForDirectDeposit, setIsEligibleForDirectDeposit] = useState(
    false,
  );
  const currentPath = window.location.href;
  useEffect(() => {
    const checkPath = () => {
      const containsReviewAndSubmit = currentPath.includes('review-and-submit');
      setIsEligibleForDirectDeposit(!containsReviewAndSubmit);
    };

    checkPath();
  }, [currentPath]);

  return isEligibleForDirectDeposit;
};

const bankInfoHelpText = (
  <va-additional-info
    trigger="What if I don’t have a bank account?"
    onClick={gaBankInfoHelpText}
  >
    <div className="vads-u-margin-bottom--2">
      <p>
        The{' '}
        <a href="https://veteransbenefitsbanking.org/">
          Veterans Benefits Banking Program (VBBP)
        </a>{' '}
        provides a list of Veteran-friendly banks and credit unions. They’ll
        work with you to set up an account, or help you qualify for an account,
        so you can use direct deposit. To get started, call one of the
        participating banks or credit unions listed on the VBBP website. Be sure
        to mention the Veterans Benefits Banking Program.
      </p>
    </div>
  </va-additional-info>
);

const DirectDepositDescription = () => {
  const displayBankInfo = useCheckPath();

  return (
    <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
      <p>
        Direct Deposit information is not required to determine eligibility.
        However, benefits cannot be paid without this information per U.S.
        Treasury regulation 31 C.F.R. § 208.3.
      </p>
      {displayBankInfo && bankInfoHelpText}
      <p>
        Note: Federal regulation, found in 31 C.F.R. § 208.3 provides that,
        subject to section 208.4, "all Federal payments made by an agency shall
        be made by electronic funds transfer" (EFT).
      </p>
      <p>
        Note: Any bank account information you enter here will update all other
        existing Veteran benefits, including Compensation, Pension, and benefits
        for certain children with disabilities (Chapter 18) payments.
        Information entered here WILL NOT change your existing bank account for
        VA health benefits.
      </p>
      <img
        src="/img/direct-deposit-check-guide.svg"
        alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
      />
    </div>
  );
};

export default DirectDepositDescription;
