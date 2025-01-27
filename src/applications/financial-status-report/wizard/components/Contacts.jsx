import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ContactDMC = () => (
  <>
    Call us at <va-telephone contact={CONTACTS.DMC} /> (or{' '}
    <va-telephone contact={CONTACTS.DMC_OVERSEAS} international /> from
    overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If
    you have hearing loss, call (<VaTelephone contact={CONTACTS[711]} tty />
    ).
  </>
);

export default ContactDMC;
