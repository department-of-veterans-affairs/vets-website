import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import recordEvent from 'platform/monitoring/record-event';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

const recordProfileNavEvent = (customProps = {}) => {
  recordEvent({
    event: 'profile-navigation',
    ...customProps,
  });
};

const AdditionalInformation = () => (
  <>
    <div className="vads-u-margin-bottom--2">
      <AdditionalInfo
        triggerText="How do I change my direct deposit information for GI Bill and other education benefits?"
        onClick={() =>
          recordProfileNavEvent({
            'profile-action': 'view-link',
            'profile-section': 'how-to-change-direct-deposit',
          })
        }
      >
        <p>
          You’ll need to sign in to the eBenefits website with your Premium DS
          Logon account to change your direct deposit information for GI Bill
          and other education benefits online.
        </p>
        <p>
          If you don’t have a Premium DS Logon account, you can register for one
          or upgrade your Basic account to Premium. Your MyHealtheVet or ID.me
          credentials won’t work on eBenefits.
        </p>
        <EbenefitsLink path="ebenefits/about/feature?feature=direct-deposit-and-contact-information">
          Go to eBenefits to change your information
        </EbenefitsLink>
        <br />
        <a href="/change-direct-deposit/#are-there-other-ways-to-change">
          Find out how to change your information by mail or phone
        </a>
      </AdditionalInfo>
    </div>
    <AdditionalInfo
      triggerText="What’s my bank’s routing number?"
      onClick={() =>
        recordProfileNavEvent({
          'profile-action': 'view-link',
          'profile-section': 'whats-bank-routing',
        })
      }
    >
      <p>
        Your bank’s routing number is a 9-digit code that’s based on the U.S.
        location where your bank was opened. It’s the first set of numbers on
        the bottom left of your paper checks. You can also search for this
        number on your bank’s website. If your bank has multiple routing
        numbers, you’ll want the number for the state where you opened your
        account.
      </p>
    </AdditionalInfo>
  </>
);

export default AdditionalInformation;
