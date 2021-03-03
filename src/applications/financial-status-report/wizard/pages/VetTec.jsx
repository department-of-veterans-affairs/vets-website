import React from 'react';
import { PAGE_NAMES } from '../constants';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const VetTec = () => {
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        Based on the information you provided, this isn’t the form you need.
      </p>
      <p>
        <strong>For help with VET TEC program debt,</strong> contact us by
        email, phone, or mail.
      </p>
      <ul>
        <li>
          <strong>Email: </strong>
          <a href="mailto:vettec.vbauf@va.gov">VETTEC.VBAUF@va.gov</a>.
        </li>
        <li>
          <strong>Phone: </strong>
          Call us at <Telephone contact={'716-857-5061'} /> (TTY:{' '}
          <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />)
          and leave a detailed message. We'll call you back as soon as possible.
        </li>
        <li>
          <strong>Mail: </strong>
          <div>VA Regional Processing Office 307</div>
          <div>P.O. Box 4616</div>
          <div>Buffalo, NY 14240-4616</div>
        </li>
      </ul>
    </div>
  );
};

export default {
  name: PAGE_NAMES.vettec,
  component: VetTec,
};
