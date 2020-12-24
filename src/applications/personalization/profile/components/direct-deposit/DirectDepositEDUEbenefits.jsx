import React from 'react';

import ProfileInfoTable from '../ProfileInfoTable';

const educationBenefitsData = [
  {
    value: (
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <p className="vads-u-margin-top--0">
          You’ll need to sign in to the eBenefits website with your{' '}
          <strong>Premium DS Logon</strong> account to change your direct
          deposit information for GI Bill and other education benefits online.
        </p>{' '}
        <p>
          If you don’t have a <strong>Premium DS Logon</strong> account, you can
          register for one or upgrade your Basic account to Premium. Your{' '}
          <strong>MyHealtheVet</strong> or <strong>ID.me</strong> credentials
          won’t work on eBenefits.
        </p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=direct-deposit-and-contact-information"
        >
          Go to eBenefits to change your information
        </a>
        <a
          className="vads-u-margin-top--2"
          target="_blank"
          rel="noopener noreferrer"
          href="https://va.gov/change-direct-deposit/"
        >
          Find out how to change your information by mail or phone
        </a>
      </div>
    ),
  },
];

function DirectDepositEDUeBenefits() {
  return (
    <ProfileInfoTable title="Education benefits" data={educationBenefitsData} />
  );
}

export default DirectDepositEDUeBenefits;
