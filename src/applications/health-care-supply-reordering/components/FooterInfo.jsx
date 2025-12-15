import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import DlcTelephoneLink from './DlcTelephoneLink';

const FooterInfo = () => (
  <section className="need-help-footer row vads-u-padding-x--1p5">
    <p>
      <strong>
        For help filling out this form, or if the form isn’t working right,
      </strong>{' '}
      please call VA Benefits and Services at{' '}
      <va-telephone contact={CONTACTS.VA_BENEFITS} />. If you have hearing loss,
      call <va-telephone contact={CONTACTS['711']} tty />.
    </p>
    <p>
      <strong>For help ordering hearing aid or CPAP supplies,</strong> please
      call the DLC Customer Service Section at <DlcTelephoneLink /> or email{' '}
      <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
    </p>
  </section>
);

export default FooterInfo;
