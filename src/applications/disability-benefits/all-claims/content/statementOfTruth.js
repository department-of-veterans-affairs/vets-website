import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const body = (
  <>
    <p>
      I certify and authorize the release of information. I authorize any person
      or entity, including but not limited to any organization, service
      provider, employer, or government agency, to give the Department of
      Veterans Affairs any information about me. For the limited purpose of
      providing VA with this information as it may relate to my claim, I waive
      any privilege that may apply and would otherwise make the information
      confidential and not disclosable.
    </p>
    <p>
      I certify I have received the notice on this application titled,{' '}
      <strong>Notice of Evidence Needed</strong>.
    </p>
    <p>
      I certify I have enclosed all the information or evidence that will
      support my claim, to include an identification of relevant records
      available at a Federal facility such as a VA medical center;{' '}
      <strong>OR</strong>, I have no information or evidence to give VA to
      support my claim; <strong>OR</strong>, I plan to submit additional
      evidence in support of my claim and will have my claim processed under the
      standard claim process.
    </p>
  </>
);

export default function getStatementOfTruth() {
  if (!environment.isLocalhost()) {
    return undefined;
  }
  return {
    body,
    heading: 'Claim certification and signature',
  };
}
