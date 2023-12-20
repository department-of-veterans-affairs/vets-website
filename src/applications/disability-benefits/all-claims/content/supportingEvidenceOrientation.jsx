import React from 'react';
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
    </div>
  );
};
