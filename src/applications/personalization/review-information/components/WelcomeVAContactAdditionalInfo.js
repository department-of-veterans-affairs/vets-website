import React from 'react';

const WelcomeVAContactAdditionalInfo = (
  <div>
    <va-additional-info
      trigger="Which benefits and services does VA use this contact information for?"
      uswds
    >
      <div>
        <p className="vads-u-margin-y--1">
          We use this information to contact you about VA benefits like
          disability compensation and pension benefits. If you’re enrolled in VA
          health care, we also use this information to send you updates like
          appointment and prescription refill reminders. But some VA
          departments, like education and home loan benefits, keep their own
          separate records. So you’ll need to contact them directly to change
          your contact information.
        </p>
        <p>
          <va-link
            href="/resources/change-your-address-on-file-with-va/#change-your-address-by-contact"
            text="Learn how to change your address and other contact information for different VA benefits"
          />
        </p>
      </div>
    </va-additional-info>
  </div>
);

export default WelcomeVAContactAdditionalInfo;
