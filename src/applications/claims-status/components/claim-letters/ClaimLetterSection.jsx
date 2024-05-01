import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

export default function ClaimLetterSection() {
  return (
    <div className="claim-letter-section vads-u-margin-top--4 vads-u-margin-bottom--4">
      <h2 id="your-claim-letters">Your claim letters</h2>
      <Link className="active-va-link" to="/your-claim-letters">
        Download your VA claim letters
        <i aria-hidden="true" />
      </Link>
      <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0p5">
        You can download your decision letter online. You can also get other
        letters related to your claims and appeals.
      </p>
    </div>
  );
}
