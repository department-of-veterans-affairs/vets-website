import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const FooterInfo = () => (
  <section className="need-help-footer row vads-u-padding-x--1p5">
    For help filling out this form, or if the form isn’t working right, please
    call VA Benefits and Services at{' '}
    <va-telephone contact={CONTACTS.VA_BENEFITS} />. If you have hearing loss,
    call <va-telephone contact={CONTACTS['711']} tty />. For help ordering
    hearing aid or CPAP supplies, please call the DLC Customer Service Section
    at <va-telephone contact="8776778710" /> (
    <va-telephone contact={CONTACTS['711']} tty />) or email{' '}
    <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
  </section>
);

export default FooterInfo;
