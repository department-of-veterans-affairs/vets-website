import React from 'react';

export const claimExamsDescription = (
  <div>
    <p>
      After you file your disability claim, we may ask you to have a claim exam
      (also known as a C&P exam).
    </p>

    <va-alert status="warning" uswds>
      <h3 slot="headline">
        You might receive a phone call from an unfamiliar number to schedule
        your exam
      </h3>
      <p className="vads-u-font-size--base">
        You’ll receive a phone call from a VA third-party vendor or from VA to
        schedule your exam. It’s important that you answer any calls you receive
        after you file a disability claim.
      </p>
      <p>
        You can go to your{' '}
        <a href="/profile" target="_blank" rel="noreferrer">
          VA.gov profile (opens in new tab)
        </a>{' '}
        to confirm your phone number.
      </p>
    </va-alert>

    <p>At this time we partner with 3 vendors:</p>
    <ul>
      <li>QTC Medical Services (QTC)</li>
      <li>Veterans Evaluation Services (VES)</li>
      <li>Logistics Health Inc. (LHI)</li>
    </ul>
  </div>
);

export const claimExamsFAQ = (
  <>
    <h3 className="vads-u-font-size--h4">More information about claim exams</h3>
    <va-accordion bordered uswds>
      <va-accordion-item bordered uswds>
        <h4 slot="headline">What happens if I miss a phone call?</h4>
        <p>
          If we can’t reach you by phone, we’ll schedule an appointment for you.
          We’ll send you a letter with the date and time of your exam.
        </p>
        <p>
          Please call the number on your appointment letter to confirm your exam
          time and location.
        </p>
        <p>
          If you can’t make your appointment, let us know right away. You can
          most likely reschedule, but this may delay your claim.
        </p>
        <p>
          If you’re a Veteran who lives overseas, you may{' '}
          <a
            href="https://www.benefits.va.gov/persona/veteran-abroad.asp"
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            contact an Overseas Military Services Coordinator (opens in new tab)
          </a>{' '}
          for help scheduling a claim exam.
        </p>
      </va-accordion-item>
      <va-accordion-item bordered uswds>
        <h4 slot="headline">Why do I need a claim exam?</h4>
        <p>
          Not everyone who files a disability claim will need an exam. We’ll ask
          you to have an exam only if we need more information to decide your
          claim.
        </p>
      </va-accordion-item>
    </va-accordion>
  </>
);
