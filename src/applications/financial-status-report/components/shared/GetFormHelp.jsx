import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const GetFormHelp = () => {
  return (
    <>
      <p>
        If you have trouble using this online form, call our MyVA411 main
        information line at <va-telephone contact={CONTACTS.VA_411} /> (
        <va-telephone contact={CONTACTS[711]} tty />
        ).
      </p>
      <p>
        If you need help with your request, you can appoint a VA accredited
        representative.
        <br />
        <a href="https://www.va.gov/get-help-from-accredited-representative/">
          Get help filling out a form
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
    </>
  );
};

export default GetFormHelp;
