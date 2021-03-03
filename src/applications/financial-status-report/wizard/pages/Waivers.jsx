import React from 'react';
import { PAGE_NAMES } from '../constants';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const Waivers = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
    <p className="vads-u-margin-top--0">
      Based on the information you provided, this isn’t the form you need.
    </p>
    <p>
      <strong>
        To ask our Committee of Waivers and Compromises to reconsider your
        waiver,{' '}
      </strong>
      you’ll need to tell us why you think we should reconsider.
    </p>
    <p>You can submit your request online, by phone, or by mail.</p>
    <ul>
      <li>
        <strong>Online: </strong>
        <a href="https://iris.custhelp.va.gov/app/ask">
          Go to our online question form (called IRIS)
        </a>
        . On the IRIS page, select <strong>Debt Management Center</strong>, your
        debt type, and <strong>Waiver</strong> within the Topic dropdown. For
        Inquiry Type, select <strong>Question</strong>. Write your request in
        the <strong>Question</strong> section.
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
  name: PAGE_NAMES.waivers,
  component: Waivers,
};
