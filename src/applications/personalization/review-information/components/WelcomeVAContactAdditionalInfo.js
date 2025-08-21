import React from 'react';

const WelcomeVAContactAdditionalInfo = (
  <div>
    <va-additional-info
      trigger="Which benefits and services does VA use this contact information for?"
      uswds
    >
      <div>
        <p className="vads-u-margin-y--1">
          We use this information to contact you about these VA benefits and
          services:
        </p>
        <ul>
          <li>Disability compensation</li>
          <li>Pension benefits</li>
          <li>Claims and appeals</li>
          <li>Veteran Readiness and Employment (VR&E)</li>
        </ul>
        <p>
          If you’re enrolled in VA health care, we also use this information to
          send you these:
        </p>
        <ul>
          <li>Appointment reminders</li>
          <li>Communications from your VA medical center</li>
          <li>Lab and test results</li>
          <li>
            Prescription medicines (we send your medicines to your mailing
            address)
          </li>
        </ul>
        <p>
          <a
            href="/resources/change-your-address-on-file-with-va/#change-your-address-by-contact"
            target="_blank"
          >
            Find out how to change your contact information for other VA
            benefits{' '}
          </a>
        </p>
      </div>
    </va-additional-info>
  </div>
);

export default WelcomeVAContactAdditionalInfo;
