import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { PAGE_NAMES } from '../constants';
import DelayedLiveRegion from '../DelayedLiveRegion';

const ContactBenefits = () => {
  useEffect(() => {
    recordEvent({
      event: 'howToWizard-alert-displayed',
      'reason-for-alert': 'debt related to separation pay/attorney fees',
    });
  }, []);

  return (
    <DelayedLiveRegion>
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
        <h2
          className="vads-u-margin-top--0 vads-u-font-size--h6 vads-u-font-weight--normal vads-u-font-family--sans"
          id="wizard-results"
        >
          Based on the information you provided, this isn’t the form you need.
        </h2>
        <p>
          <strong>
            For help with debt related to separation pay/attorney fees
          </strong>
          , call us at <VaTelephone contact="800-827-1000" uswds />. We’re here
          Monday through Friday, 7:00 a.m. to 8:00 p.m. ET. If you have hearing
          loss, call (<VaTelephone contact={CONTACTS[711]} tty uswds />
          ).
        </p>
      </div>
    </DelayedLiveRegion>
  );
};

export default {
  name: PAGE_NAMES.benefits,
  component: ContactBenefits,
};
