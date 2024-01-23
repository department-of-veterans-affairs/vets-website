import React from 'react';

export const TITLE = 'Request priority processing of an existing claim';
export const SUBTITLE = 'Priority processing request (VA form 20-10207)';

export const PREPARER_TYPES = Object.freeze({
  VETERAN: 'veteran',
  NON_VETERAN: 'non-veteran',
  THIRD_PARTY_VETERAN: 'third-party-veteran',
  THIRD_PARTY_NON_VETERAN: 'third-party-non-veteran',
});
export const PREPARER_TYPE_LABELS = Object.freeze({
  [PREPARER_TYPES.VETERAN]:
    'I’m a Veteran. I’m requesting priority processing for my claim.',
  [PREPARER_TYPES.NON_VETERAN]:
    'I’m not a Veteran, but I have an existing VA claim. I’m requesting priority processing for my claim.',
  [PREPARER_TYPES.THIRD_PARTY_VETERAN]:
    'I’m a third-party representative or power of attorney. I’m requesting priority processing on behalf of a Veteran.',
  [PREPARER_TYPES.THIRD_PARTY_NON_VETERAN]:
    'I’m a third-party representative or power of attorney. I’m requesting priority processing on behalf of a non-Veteran with a VA claim (also called the claimant).',
});

export const ADDITIONAL_INFO_THIRD_PARTY = Object.freeze(
  <va-additional-info
    trigger="Who can sign on behalf of someone else?"
    data-testid="thirdPartyAdditionalInfo"
  >
    <div>
      <p>
        <b>If you’re a third-party representative</b> (a family member or other
        assigned person who is not a power of attorney, agent, or fiduciary)
        requesting VA records for someone else, we must have an authorization
        form on record (VA Form 21-0845) for us to release their information.
      </p>
      <p>
        <a
          href="/find-forms/about-form-21-0845/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to VA Form 21-0845 Authorization to Disclose Personal Information
          to a Third-Party (opens in new tab)
        </a>
      </p>
      <p>
        <b>If you’re a power of attorney</b> requesting VA records for someone
        else, we must have an official record that you were appointed as their
        representative (VA Form 21-22 or VA Form 21-22a).
      </p>
      <p>
        <a
          href="/find-forms/about-form-21-22/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to VA Form 21-22 Appointment of Veterans Service Organization as
          Claimant’s Representative (opens in new tab)
        </a>
      </p>
      <p>
        <a
          href="/find-forms/about-form-21-22a/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to VA Form 21-22a Appointment of Individual as Claimant’s
          Representative (opens in new tab)
        </a>
      </p>
    </div>
  </va-additional-info>,
);
