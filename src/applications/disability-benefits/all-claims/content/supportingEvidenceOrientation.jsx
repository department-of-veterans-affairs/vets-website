import React from 'react';
import { isClaimingNew, isClaimingIncrease } from '../utils';

export const supportingEvidenceOrientation = ({ formData }) => {
  return (
    <div>
      <p>
        Next, we’ll ask you about evidence we’ll need to support these claims:
      </p>
      <ul>
        {isClaimingNew(formData) && (
          <li>New claims for conditions related to your military service</li>
        )}
        {isClaimingIncrease(formData) && (
          <li>Rated service-connected conditions that have gotten worse</li>
        )}
      </ul>
      <p>You can submit these types of evidence:</p>
      <ul>
        <li>
          Records from treatment providers like doctor’s reports, X-rays, or
          test results
        </li>
        <li>Official incident reports</li>
        <li>
          Lay or witness statements from family or service members (also called
          buddy statements)
        </li>
      </ul>
      <p>
        <strong>Note: </strong>
        You only need to submit new evidence that we don’t already have.
      </p>
      <va-alert status="info">
        <h3>Notice of evidence needed</h3>
        <p>
          We’re required by law to tell you what evidence you’ll need to submit
          to support your disability claim.
        </p>
        <p>
          We refer to this notice of evidence requirements as the “section 5103
          notice.”
        </p>
        <p>
          <va-link
            external
            href="https://www.va.gov/disability/how-to-file-claim/evidence-needed/"
            text="Learn about what evidence you’ll need"
          />
        </p>
      </va-alert>
    </div>
  );
};
