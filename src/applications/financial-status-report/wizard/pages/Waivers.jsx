import React from 'react';
import { PAGE_NAMES } from '../constants';
import ContactDMC from '../components/Contacts';

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
        <ContactDMC />
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
