import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => {
  return (
    <div>
      <p>
        If you have trouble using this online form, call our MyVA411 main
        information line at <va-telephone contact="8006982411" /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ).
      </p>
      <p>
        If you need help to gather your information or fill out your form,
        <a href="https://www.va.gov/vso/" className="vads-u-margin-left--0p5">
          contact a local Veterans Service Organization (VSO)
        </a>
        .
      </p>
      <p>
        If you have questions about your benefit overpayments, call us at{' '}
        <va-telephone contact={CONTACTS.DMC || '8008270648'} /> (or{' '}
        <va-telephone
          contact={CONTACTS.DMC_OVERSEAS || '6127136415'}
          international
        />{' '}
        from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m.
        ET.
      </p>
      <p>
        If you have questions about your copay bills, call us at{' '}
        <va-telephone contact="8664001238" />. We’re here Monday through Friday,
        8:00 a.m. to 8:00 p.m. ET.
      </p>
    </div>
  );
};

export default GetFormHelp;
