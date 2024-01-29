import React from 'react';

export default function GenderIdentityAdditionalInfo() {
  return (
    <>
      <p className="vads-u-color--gray-medium vads-u-display--block vads-u-font-weight--normal vads-u-margin--0 vads-u-width--full">
        You can change your selection at any time. If you decide you no longer
        want to share your gender identity, select{' '}
        <strong>Prefer not to answer</strong>.
      </p>
      <va-additional-info
        class="vads-u-margin-top--2"
        trigger="What to know before you decide to share your gender identity"
        uswds
      >
        <div className="vads-u-color--black">
          <p className="vads-u-margin-top--0">
            Sharing your gender identity in your VA.gov profile is optional. If
            you get health care at VA, this information can help your care team
            better assess your health needs and risks.
          </p>

          <p>
            But you should know that any information you share in your VA.gov
            profile goes into your VA-wide records. VA staff outside of the
            health care system may be able to read this information.
          </p>

          <p className="vads-u-margin-bottom--0">
            We follow strict security and privacy practices to keep your
            personal information secure. But if you want to share your gender
            identity in your health records only, talk with your health care
            team.
          </p>
        </div>
      </va-additional-info>
    </>
  );
}
