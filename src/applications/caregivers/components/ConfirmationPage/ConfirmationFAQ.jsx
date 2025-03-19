import React, { useMemo } from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const ConfirmationFAQ = () => {
  const directoryLink = useMemo(
    () => (
      <va-link
        text="Go to our Caregiver Support Program Teams directory"
        href="https://www.caregiver.va.gov/support/New_CSC_Page.asp"
      />
    ),
    [],
  );
  const supportLine = useMemo(
    () => (
      <>
        <va-telephone contact={CONTACTS.CAREGIVER} /> (
        <va-telephone contact={CONTACTS[711]} tty />)
      </>
    ),
    [],
  );

  return (
    <>
      <section className="caregiver-confirmation-faq">
        <h2>What to expect next</h2>
        <p>
          A member of the Caregiver Support Team where the Veteran receives care
          or plans to receive care will contact the Veteran and any caregivers
          to discuss this application and eligibility.
        </p>
        <p>
          <strong>If you gave us your email address,</strong> you’ll receive a
          confirmation email first. Then we’ll contact you to discuss this
          application and eligibility. Be sure to check email inbox, spam, or
          junk folders.
        </p>
        <p>
          <strong>If you didn’t give us your email address,</strong> we’ll
          contact you by phone or mail.
        </p>
      </section>

      <section className="caregiver-confirmation-faq">
        <h2>What to do if you have questions now</h2>
        <p>
          If you have questions, you can contact a Caregiver Support Team at
          your nearest VA health facility.
        </p>
        <p className="no-print">{directoryLink}</p>
        <p>Or you can call us at {supportLine}.</p>
      </section>

      <section className="caregiver-confirmation-faq">
        <h2>What you can do if your application is denied</h2>
        <p>
          If your application is denied, we’ll send you a letter with the reason
          why we denied your application.
        </p>
        <p>
          If you disagree with the decision, you can appeal or request a review
          of the decision.
        </p>
        <p className="no-print">
          <va-link
            text="Learn more about family caregiver program decision reviews and appeals"
            href="/decision-reviews/family-caregiver-program-reviews/"
          />
        </p>
        <p>
          You may also be eligible for the Program of General Caregiver Support
          Services (PGCSS) program.
        </p>
        <p>Here’s how you can learn more:</p>
        <ul>
          <li>
            Read about the{' '}
            <va-link
              text="Program of General Caregiver Support Services"
              href="https://www.caregiver.va.gov/Care_Caregivers.asp"
            />
          </li>
          <li>Call the Caregiver Support Line at {supportLine}</li>
          <li>
            Find a Caregiver Support Team at your nearest VA health facility.{' '}
            <span className="no-print">{directoryLink}</span>
          </li>
        </ul>
      </section>
    </>
  );
};

export default React.memo(ConfirmationFAQ);
