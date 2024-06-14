import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const FooterInfo = () => (
  <section className="need-help-footer row vads-u-padding-x--1p5">
    For benefit-related questions, or if the form isn’t working right, please
    call VA Benefits and Services at{' '}
    <va-telephone contact={CONTACTS.VA_BENEFITS} />. If you have hearing loss,
    call <va-telephone contact={CONTACTS['711']} tty />.
  </section>
);

export default FooterInfo;
