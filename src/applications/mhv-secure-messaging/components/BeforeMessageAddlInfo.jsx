import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const BeforeMessageAddlInfo = () => (
  <VaAdditionalInfo
    trigger="Before you send a message"
    disable-analytics={false}
    disable-border={false}
  >
    <div>
      With secure messaging, you can communicate online with your VA health care
      teams and staff. Use Secure Messaging to:
    </div>
    <ul>
      <li>ask a non-urgent, non-emergency question related to health</li>
      <li>update your VA care team on your health condition</li>
      <li>request to schedule, cancel, or reschedule a VA appointment</li>
      <li>ask for a referral from your VA provider</li>
      <li>request to renew a prescription that has expired</li>
    </ul>
    <div>
      The health care services below use secure messaging, but not all providers
      for these services use it. So check with your health care team before you
      try to send them a message.
    </div>
    <ul>
      <li>Primary Care</li>
      <li>Specialty Medicine</li>
      <li>Rehabilitative Medicine</li>
      <li>Prosthetics Services</li>
      <li>Surgical Care</li>
      <li>Mental Health</li>
      <li>Dentistry</li>
      <li>
        Some non-clinical programs and departments within Veterans Health
        Administration
      </li>
    </ul>
  </VaAdditionalInfo>
);

export default BeforeMessageAddlInfo;
