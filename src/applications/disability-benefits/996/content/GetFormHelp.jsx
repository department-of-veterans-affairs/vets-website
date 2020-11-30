import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

const GetFormHelp = () => (
  <>
    <p className="help-talk">
      If you have questions or need help filling out this form, please call us
      at <Telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday through
      Friday, 8:00 a.m. to 9:00 p.m. ET.
    </p>
    <p className="u-vads-margin-bottom--0">
      If you have hearing loss, call TTY:{' '}
      <Telephone contact={CONTACTS['711']} pattern={PATTERNS['3_DIGIT']} />.
    </p>
  </>
);

export default GetFormHelp;
