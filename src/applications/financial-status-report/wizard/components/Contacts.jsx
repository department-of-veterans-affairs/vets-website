import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const ContactDMC = () => (
  <>
    Call us at <Telephone contact={CONTACTS.DMC || '800-827-0648'} /> (or{' '}
    <Telephone
      contact={CONTACTS.DMC_OVERSEAS || '1-612-713-6415'}
      pattern={PATTERNS.OUTSIDE_US}
    />{' '}
    from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
    If you have hearing loss, call TTY:{' '}
    <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />.
  </>
);

export default ContactDMC;
