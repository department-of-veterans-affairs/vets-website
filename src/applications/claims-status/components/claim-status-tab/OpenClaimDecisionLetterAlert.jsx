import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

export default function OpenClaimDecisionLetterAlert() {
  return (
    <va-alert class="vads-u-margin-bottom--4" status="info">
      <h2 id="claims-alert-header" slot="headline">
        You have a decision letter for part of this claim
      </h2>
      <p>
        <strong>Another part of this claim is still in progress</strong>
      </p>
      <p>
        You can download your decision letter online now. You can also get other
        letters related to your claims.
      </p>
      <p className="vads-u-margin-y--0">
        We’ll also send you a copy of your decision letter by mail. It within 10
        days after the date we closed your claim, but it may take take longer.
      </p>
      <div className="link-action-container">
        <Link className="vads-c-action-link--blue" to="/your-claim-letters">
          Get your claim letters
        </Link>
      </div>
    </va-alert>
  );
}
