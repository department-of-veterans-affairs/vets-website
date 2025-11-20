import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const NeedHelpCopay = () => (
  <va-need-help data-testid="need-help" class="vads-u-margin-top--4">
    <div slot="content">
      <p>
        You can contact us online through{' '}
        <va-link text="Ask VA" href="https://ask.va.gov" /> or call the VA
        Health Resource Center at{' '}
        <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} /> (
        <va-telephone contact="711" tty="true" />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </div>
  </va-need-help>
);

export default NeedHelpCopay;
