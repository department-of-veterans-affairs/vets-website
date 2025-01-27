import React from 'react';

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
    <p>I certify I have received the evidence requirements for my claim.</p>
    <p>
      <va-link
        external
        href="https://www.va.gov/disability/how-to-file-claim/evidence-needed/"
        text="Review the evidence requirements"
      />
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

// plain text version of the body
const plainBody =
  'I certify and authorize the release of information. I authorize any person ' +
  'or entity, including but not limited to any organization, service provider, ' +
  'employer, or government agency, to give the Department of Veterans Affairs ' +
  'any information about me. For the limited purpose of providing VA with this ' +
  'information as it may relate to my claim, I waive any privilege that may ' +
  'apply and would otherwise make the information confidential and not ' +
  'disclosable. I certify I have received the evidence requirements for my claim. ' +
  'Review the evidence requirements https://www.va.gov/disability/how-to-file-claim/evidence-needed/ ' +
  'I certify I have enclosed all the information or evidence that will support ' +
  'my claim, to include an identification of relevant records available at a ' +
  'Federal facility such as a VA medical center; OR, I have no information or ' +
  'evidence to give VA to support my claim; OR, I plan to submit additional ' +
  'evidence in support of my claim and will have my claim processed under the ' +
  'standard claim process.';

export default function getPreSubmitInfo() {
  return {
    statementOfTruth: {
      body,
      heading: 'Claim certification and signature',
      messageAriaDescribedby: plainBody,
      useProfileFullName: true,
    },
  };
}
