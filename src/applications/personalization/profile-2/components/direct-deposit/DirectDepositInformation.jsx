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
  <div className="vads-u-margin-bottom--4">
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
  </div>
);

export default AdditionalInformation;
