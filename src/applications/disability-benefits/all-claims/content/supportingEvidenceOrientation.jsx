import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { isClaimingNew, isClaimingIncrease } from '../utils';

export const supportingEvidenceOrientation = ({ formData }) => {
  return (
    <div>
      <p>
        On the next few screens, we’ll ask you where we can find evidence
        (supporting documents like doctor’s reports, X-rays, and medical test
        results) related to:
      </p>
      <ul>
        {isClaimingIncrease(formData) && (
          <li>Your rated service-connected conditions</li>
        )}
        {isClaimingNew(formData) && (
          <li>Your new service-connected conditions</li>
        )}
      </ul>
      <p>
        You don’t need to turn in any evidence that you submitted with an
        earlier claim.{' '}
        <strong>
          You only need to submit new evidence that VA doesn’t already have.
        </strong>
      </p>
      {environment.isLocalhost() && (
        <va-alert slim status="info">
          <h4 className="vads-u-font-size--h6">Notice of evidence needed</h4>
          <p className="vads-u-margin-bottom--1">
            We’re required by law to tell you what evidence you’ll need to
            submit to support your disability claim.
          </p>
          <p className="vads-u-margin-y--1">
            You can review the evidence requirements on our evidence needed for
            your disability claim page.
          </p>
          <p className="vads-u-margin-bottom--1">
            <va-link
              external
              href="https://www.va.gov/disability/how-to-file-claim/evidence-needed/"
              text="Review the evidence requirements"
            />
          </p>
        </va-alert>
      )}
    </div>
  );
};
