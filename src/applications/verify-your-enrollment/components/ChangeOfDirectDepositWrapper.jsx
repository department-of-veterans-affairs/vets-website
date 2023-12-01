import React, { useState } from 'react';
import ChangeOfDirectDepositForm from './ChangeOfDirectDepositForm';

import { CHANGE_OF_DIRECT_DEPOSIT_TITLE } from '../constants';

const ChangeOfDirectDepositWrapper = () => {
  const [toggleDirectDepositForm, setToggleDirectDepositForm] = useState(false);

  const directDepositDescription = (
    <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
      <p>
        Please enter your bank’s routing and account numbers and your account
        type.
      </p>
      <img
        src="/img/direct-deposit-check-guide.svg"
        alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
      />
    </div>
  );

  const gaBankInfoHelpText = () => {
    window.dataLayer.push({
      event: 'VYE-change-of-direct-deposit-help-text-clicked',
      'help-text-label': 'What if I don’t have a bank account?',
    });
  };

  const bankInfoHelpText = (
    <va-additional-info
      trigger="What if I don’t have a bank account?"
      onClick={gaBankInfoHelpText}
    >
      <span>
        <p>
          The{' '}
          <a href="https://veteransbenefitsbanking.org/">
            Veterans Benefits Banking Program (VBBP)
          </a>{' '}
          provides a list of Veteran-friendly banks and credit unions. They’ll
          work with you to set up an account, or help you qualify for an
          account, so you can use direct deposit. To get started, call one of
          the participating banks or credit unions listed on the VBBP website.
          Be sure to mention the Veterans Benefits Banking Program.
        </p>
        <p>
          Note: Federal regulation, found in 31 C.F.R. § 208.3 provides that,
          subject to section 208.4, “all Federal payments made by an agency
          shall be made by electronic funds transfer” (EFT).
        </p>
      </span>
    </va-additional-info>
  );

  const handleClick = () => {
    setToggleDirectDepositForm(true);
  };

  return (
    <div>
      <p className="vads-u-font-size--h2">{CHANGE_OF_DIRECT_DEPOSIT_TITLE}</p>
      <div
        className="vads-u-border-color--gray-lighter
            vads-u-color-gray-dark
            vads-u-display--flex
            vads-u-flex-direction--column
            vads-u-padding-x--2
            vads-u-padding-y--1p5
            medium-screen:vads-u-padding--4
            vads-u-border--1px"
      >
        {!toggleDirectDepositForm && (
          <>
            <va-button onClick={handleClick} text="Add new account" />
            <va-alert
              close-btn-aria-label="Close notification"
              status="info"
              visible
              background-only
              class="vads-u-margin-y--2"
            >
              <h2 id="VYE-chnage-of-direct-deposit" slot="headline">
                Change of Direct Deposit for Veryify Your Enrollment
              </h2>
              <div>
                <span className="vads-u-margin-y--0">
                  <p>
                    This direct deposit information is only used for payments
                    for Montgomery GI Bill Benefits
                  </p>
                  <p>
                    To change your direct deposit information for other VA
                    services, edit your{' '}
                    <a href="https://www.va.gov/profile/personal-information">
                      VA Profile.
                    </a>
                  </p>
                </span>
              </div>
            </va-alert>
            {bankInfoHelpText}
          </>
        )}
        {toggleDirectDepositForm && (
          <div>
            <p>Direct deposit information</p>
            {directDepositDescription}
            <ChangeOfDirectDepositForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeOfDirectDepositWrapper;
