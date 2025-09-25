import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const NeedHelp = () => (
  <va-need-help id="needHelp" class="vads-u-margin-top--4">
    <div slot="content">
      <p>
        If you have any questions about your benefit overpayment or if you think
        your debt was created in an error, you can dispute it. Contact us online
        through <a href="https://ask.va.gov/">Ask VA</a> or call the Debt
        Management Center at <va-telephone contact={CONTACTS.DMC} /> (
        <va-telephone contact="711" tty="true" />
        ). For international callers, use{' '}
        <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />. We’re
        here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>
    </div>
  </va-need-help>
);

export default NeedHelp;
