import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const NeedHelp = () => (
  <va-need-help id="needHelp" class="vads-u-margin-top--4">
    <div slot="content">
      <p>
        If you have any questions about your benefit overpayment contact us
        online through <va-link href="https://ask.va.gov/" text="Ask VA" /> or
        call us at <va-telephone contact={CONTACTS.DMC} /> (
        <va-telephone contact="711" tty="true" />
        ). If you’re outside the U.S., call{' '}
        <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />. We’re
        here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>
    </div>
  </va-need-help>
);

export default NeedHelp;
