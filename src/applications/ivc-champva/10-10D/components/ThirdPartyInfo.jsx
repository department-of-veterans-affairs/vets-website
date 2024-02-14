import React from 'react';

export const thirdPartyInfoUiSchema = {
  'view:additionalInfo': {
    'ui:description': (
      <va-additional-info
        trigger="Who can be a third-party representative or power of attorney?"
        class="vads-u-margin-bottom--4"
      >
        <p className="vads-u-margin-y--0">
          A third-party representative can be a family member or designated
          person filling out this form for a Veteran or someone with a claim. We
          consider you to be a third-party representative if you’re not already
          a power of attorney, agent, or fiduciary. If you’re a third-party
          representative, we must have an authorization (VA Form 21-0845) on
          record.
          <br />
          <a href="https://www.va.gov/find-forms/about-form-21-0845/">
            Go to VA Form 21-0845 Authorization to Disclose Personal Information
            to a Third-Party (opens in new tab)
          </a>
          <br />
          An authorized power of attorney can fill out this request for the
          person with the claim. If you’re a power of attorney, we must have one
          of these records on file:
        </p>
        <ul>
          <li>
            <a href="https://www.va.gov/find-forms/about-form-21-22/">
              VA Form 21-22 Appointment of Veterans Service Organization as
              Claimant’s Representative (opens in new tab)
            </a>
          </li>
          <li>
            <a href="https://www.va.gov/find-forms/about-form-21-22a/">
              VA Form 21-22a, Appointment of Individual as Claimant’s
              Representative (opens in new tab)
            </a>
          </li>
        </ul>
      </va-additional-info>
    ),
  },
};

export const thirdPartyInfoSchema = {
  'view:additionalInfo': {
    type: 'object',
    properties: {},
  },
};
