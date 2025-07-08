import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const NeedHelp = () => (
  <div>
    <footer slot="content">
      <p>
        If you have trouble using this online form, call our MyVA411 main
        information line at <va-telephone contact={CONTACTS.HELP_DESK} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ).
      </p>
      <p>
        If you need help to gather your information or fill out your form,
        contact an accredited representative or VSO.
        <br />
        <a href="/disability/get-help-filing-claim/">
          Get help filling out your form
        </a>
      </p>
      <p>
        If you have questions about your benefit overpayments, call us at{' '}
        <va-telephone contact={CONTACTS.DMC} /> (or{' '}
        <va-telephone contact={CONTACTS.DMC_OVERSEAS} international /> from
        overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
      </p>
      <p>
        If you have questions about your copay bills, call us at{' '}
        <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} />. We’re here
        Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </footer>
  </div>
);

export default NeedHelp;
