import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const NeedHelp = () => (
  <va-need-help class="vads-u-margin-y--4">
    <div slot="content">
      <p>
        Call us at the VA benefits hotline{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday
        through Friday, 8:00 a.m to 9:00 p.m ET. If you have hearing loss, call{' '}
        <va-telephone contact={CONTACTS['711']} tty />.
      </p>
      <p>
        You can also call MYVA411 main information line{' '}
        <va-telephone contact={CONTACTS.HELP_DESK} /> available 24/7 or{' '}
        <va-link
          href="https://ask.va.gov/"
          text="contact us online through Ask VA"
        />
      </p>
    </div>
  </va-need-help>
);

export default NeedHelp;
