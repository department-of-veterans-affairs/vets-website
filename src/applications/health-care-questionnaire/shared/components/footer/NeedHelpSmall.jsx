import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export default function NeedHelpSmall() {
  return (
    <div className="emergency-call-out">
      <p>
        <strong>Note:</strong> If you need to talk to someone right away or need
        emergency care,
      </p>
      <ul>
        <li>
          Call <Telephone contact="911" />, or
        </li>
        <li>
          Call the Veterans Crisis hotline at <Telephone contact="988" /> and
          select 1
        </li>
      </ul>
    </div>
  );
}
