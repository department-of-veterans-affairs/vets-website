import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

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
        <Link
          className="active-va-link"
          data-testid="VA Form 21-4142"
          to="https://www.va.gov/find-forms/about-form-21-4142a/"
        >
          VA Form 21-4142
          <va-icon icon="chevron_right" size={3} aria-hidden="true" />
        </Link>
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
        <Link
          className="active-va-link"
          data-testid="VA Form 21-4192"
          to="https://www.va.gov/find-forms/about-form-21-4192/"
        >
          VA Form 21-4192
          <va-icon icon="chevron_right" size={3} aria-hidden="true" />
        </Link>
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
        <p>
          If you don’t already have a bank account, the Veterans Benefits
          Banking Program (VBBP) can connect you with a bank that will help you
          set up an account.
        </p>
        <Link
          className="active-va-link"
          data-testid="Add direct deposit information"
          to="https://www.va.gov/resources/direct-deposit-for-your-va-benefit-payments/"
        >
          Add direct deposit information
          <va-icon icon="chevron_right" size={3} aria-hidden="true" />
        </Link>
      </>
    ),
    isProperNoun: false,
  },
};
