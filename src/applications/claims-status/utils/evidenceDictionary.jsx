import React from 'react';

export const evidenceDictionary = {
  '21-4142/21-4142a': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we need your permission to request your
          personal information from a non-VA source, like a private doctor or
          hospital.
        </p>
        <p>Personal information may include:</p>
        <ul className="bullet-disc">
          <li>Medical treatments</li>
          <li>Hospitalizations</li>
          <li>Psychotherapy</li>
          <li>Outpatient care</li>
        </ul>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Use VA Form 21-4142 to give us permission to request your personal
          information.
        </p>
        <p>
          You can complete and sign this form online, or use a PDF version and
          upload or mail it.
        </p>
        <va-link
          className="active-va-link"
          data-testid="VA Form 21-4142"
          text="VA Form 21-4142"
          href="/find-forms/about-form-21-4142a/"
        />
      </>
    ),
  },
  'Employment info needed': {
    longDescription: (
      <p>
        For your benefits claim, we need employment information from your most
        recent employer.
      </p>
    ),
    nextSteps: (
      <>
        <p>
          Give VA Form 21-4192 to your most recent employer and ask them to mail
          us your employment information.
        </p>
        <va-link
          active
          text="Share your VA medical records"
          data-testid="VA Form 21-4192"
          href="/find-forms/about-form-21-4192/"
        />
      </>
    ),
    isProperNoun: false,
  },
  'EFT - Treasury Mandate Notification': {
    longDescription: (
      <p>
        For your benefits claim, we need your direct deposit information in
        order to pay benefits, if awarded.
      </p>
    ),
    nextSteps: (
      <>
        <p>
          You can update your direct deposit information in your VA.gov profile,
          by phone, or by mail.
        </p>
        <va-link
          active
          text="Add or change direct deposit information"
          data-testid="Add or change direct deposit information"
          href="/profile/direct-deposit"
        />
        <p>
          If you don’t already have a bank account, the Veterans Benefits
          Banking Program (VBBP) can connect you with a bank that will help you
          set up an account.
        </p>
        <va-link
          external
          text="Set up a bank account through VBBP (opens in new tab)"
          data-testid="Set up a bank account through VBBP"
          href="https://veteransbenefitsbanking.org/"
        />
      </>
    ),
    isProperNoun: false,
  },
  'RV1 - Reserve Records Request': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested your service records or
          treatment records from your reserve unit.
        </p>
        <p>Your records may be used to verify:</p>
        <ul className="bullet-disc">
          <li>Your service</li>
          <li>An event in your service</li>
          <li>Treatment received during your service</li>
        </ul>
      </>
    ),
  },
  'DBQ AUDIO Hearing Loss and Tinnitus': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested a disability exam for your
          hearing. The examiner’s office will contact you to schedule this
          appointment.
        </p>
      </>
    ),
    noActionNeeded: true,
  },
  'DBQ PSYCH Mental Disorders': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested a mental health exam. The
          examiner’s office will contact you to schedule this appointment.
        </p>
      </>
    ),
    noActionNeeded: true,
  },
  'Proof of service (DD214, etc.)': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we’ve requested all your DD Form 214's or
          other separation papers for all your periods of military service.
        </p>
        <p>
          You can also{' '}
          <va-link
            text="request your military service records"
            href="/records/get-military-service-records/"
          />{' '}
          yourself from the National Archives.
        </p>
      </>
    ),
  },
};
