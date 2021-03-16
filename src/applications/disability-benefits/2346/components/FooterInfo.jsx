import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const FooterInfo = () => (
  <section className="need-help-footer row vads-u-padding-x--1p5">
    For benefit-related questions, or if the form isn’t working right, please
    call VA Benefits and Services at <a href="tel:800-827-1000">800-827-1000</a>
    . If you have hearing loss, call TTY:{' '}
    <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
  </section>
);

export default FooterInfo;
