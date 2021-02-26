import React from 'react';
import { pageNames } from '../constants';

const RogersStem = () => {
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        Based on the information you provided, this isn’t the form you need.
      </p>
      <p>
        <strong>For help with STEM program debt,</strong> contact us by email or
        regular mail.
      </p>
      <ul>
        <li>
          <strong>Email: </strong>
          <a href="mailto:research@va.gov">STEM.VBAUF@va.gov</a>.
        </li>
        <li>
          <strong>Mail: </strong>
          <div>VA Regional Processing Office</div>
          <div>307 P.O. Box 4616</div>
          <div>Buffalo, NY 14240-4616</div>
        </li>
      </ul>
    </div>
  );
};

export default {
  name: pageNames.stem,
  component: RogersStem,
};
