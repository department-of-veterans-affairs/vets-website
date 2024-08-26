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
            It’s your choice whether or not to share your gender identity in
            your VA.gov profile. Here’s what to know before you share:
          </p>
          <ul className="vads-u-margin-top--0 vads-u-padding-left--1">
            <li>
              <b>If you get health care at VA</b>, knowing your gender identity
              can help your care team better assess your health needs and
              personalize your care.
            </li>
            <li>
              <b>
                Any information you share in your profile goes into VA records
                that non-health care staff may also have access to.
              </b>{' '}
              We follow strict security and privacy practices to keep your
              personal information secure. But VA staff outside of the health
              care system may be able to read this information.
            </li>
            <li>
              <b>
                If you want to share your gender identity in your health records
                only,
              </b>{' '}
              don’t add this information to your VA.gov profile. Talk with your
              health care team instead.
            </li>
            <li>
              <b>
                Some VA health care systems send communications and make
                recommendations based on the birth sex on your original birth
                certificate.
              </b>{' '}
              If you’d like to discuss changing your birth sex from what was
              listed on your original birth certificate for health
              communications, contact your VA health facility’s LGBTQ+ Veteran
              care coordinator. They can help you understand the process.
              <div className="vads-u-margin-top--1">
                <va-link
                  href="/find-locations/?facilityType=health&serviceType=allVAhealthservices"
                  text="Find contact information for your VA medical center"
                />
              </div>
            </li>
          </ul>
        </div>
      </va-additional-info>
    </>
  );
}
