import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const ViewDependentsFooter = () => (
  <div>
    <h2 className="vads-u-font-size--h3 vads-u-padding-bottom--1 vads-u-border-bottom--3px vads-u-border-color--primary">
      Need help?
    </h2>
    <p>
      If you have questions about your dependents, please call VA Benefits and
      Services at{' '}
      <a className="nowrap" href="tel:1-800-827-1000">
        800-827-1000
      </a>
      .<br />
      If you have hearing loss, call TTY:{' '}
      <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />.
    </p>
  </div>
);

export default ViewDependentsFooter;
