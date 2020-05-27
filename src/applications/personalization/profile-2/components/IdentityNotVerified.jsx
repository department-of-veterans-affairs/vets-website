import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import recordEvent from 'platform/monitoring/record-event';

const IdentityNotVerified = () => {
  const content = (
    <div>
      <p>
        We need to make sure you’re you—and not someone pretending to be
        you—before we give you access to your personal and health-related
        information. This helps to keep your information safe and prevent fraud
        and identity theft.
      </p>
      <p>
        <strong>This one-time process takes about 5-10 minutes.</strong>
      </p>

      <div>
        <br />
        <a
          className="usa-button-primary va-button-primary"
          href="/verify"
          onClick={() => recordEvent({ event: 'verify-link-clicked' })}
        >
          <img alt="ID.me" src="/img/signin/idme-icon-white.svg" />
          <strong> Verify with ID.me</strong>
        </a>
      </div>
    </div>
  );

  return (
    <>
      <AlertBox
        headline="Verify your identity to view your profile"
        content={content}
        status="warning"
      />
      <div
        className="account-security-content"
        onClick={() =>
          recordEvent({
            event: 'profile-navigation',
            'profile-action': 'view-link',
            'additional-info': 'learn-more-identity',
          })
        }
      >
        <AdditionalInfo triggerText="How will VA.gov verify my identity?">
          <p>
            We use ID.me, our Veteran-owned technology partner that provides the
            strongest identity verification system available to prevent fraud
            and identity theft.
          </p>
          <p>
            <strong>To verify your identity, you’ll need both of these:</strong>
            <ul>
              <li>
                A smartphone (or a landline or mobile phone and a computer with
                an Internet connection),
                <br />
                <strong>and</strong>
              </li>
              <li>Your Social Security number</li>
            </ul>
          </p>
          <p>
            <strong>You’ll also need one of these:</strong>
            <ul>
              <li>
                A digital image of your driver’s license or passport, <br />
                <strong>or</strong>
              </li>
              <li>
                The ability to answer certain questions based on private and
                public data (like your credit report or mortgage history) to
                prove you’re you
              </li>
            </ul>
          </p>
        </AdditionalInfo>
      </div>
    </>
  );
};

export default IdentityNotVerified;
