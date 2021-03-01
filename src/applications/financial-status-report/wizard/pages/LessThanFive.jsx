import React from 'react';
import { pageNames } from '../constants';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const LessThanFive = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
    <p className="vads-u-margin-top--0">
      Based on the information you provided, this isn’t the form you need.
    </p>
    <p>
      <strong>
        We’ve changed our process for extended monthly payment plans as part of
        COVID-19 debt relief.
      </strong>
    </p>
    <p>
      You don't need to submit a Financial Status Report (VA Form 5655) to
      request an extended monthly payment plan of up to 5 years. During this
      time, you can request a plan online, by phone, or by mail.
    </p>
    <ul>
      <li>
        <strong>Online: </strong>
        <a href="#">Go to our online question form (called IRIS)</a>. On the
        IRIS page, select <strong>Debt Management Center</strong>, your debt
        type, and <strong>Payment Plan</strong> within the Topic dropdown. For
        Inquiry Type, select <strong>Question</strong>. Write your request
        within the <strong>Question</strong> section.
      </li>
      <li>
        <strong>Phone: </strong>
        Call us at <Telephone contact={'800-827-0648'} /> (or{' '}
        <Telephone contact={'1-612-713-6415'} /> from overseas). We’re here
        Monday through Friday, 7:30 a.m. to 7:00 p.m. ET. If you have hearing
        loss, call TTY:{' '}
        <Telephone contact={CONTACTS[711]} pattern={PATTERNS['3_DIGIT']} />.
      </li>
      <li>
        <strong>Mail: </strong>
        <div>Debt Management Center</div>
        <div>P.O. Box 11930</div>
        <div>St. Paul, MN 55111-0930</div>
      </li>
    </ul>
  </div>
);

export default {
  name: pageNames.lessThan,
  component: LessThanFive,
};
