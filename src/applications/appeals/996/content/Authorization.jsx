import React from 'react';

export const AuthorizationDescription = () => (
  <>
    <h3>Authorization to move to the current decision review process</h3>
    <div id="opt-in-description">
      <p>
        If you’re requesting a Higher-Level Review on a decision we made before
        February 19, 2019, we’ll need to go through our current decision review
        process.
      </p>
      <p>
        By submitting this form, you agree to move your issue from the old
        legacy appeals process to the current decision review process. You won’t
        be able to move your issue back to the legacy appeals process.
      </p>
      <p>
        We’ll likely make a faster decision on your issue in our current
        decision review process.
      </p>
    </div>
    <va-additional-info
      trigger="Read the full authorization policy"
      class="vads-u-margin-bottom--6"
    >
      <div>
        If you’ are responding to a Statement of the Case (SOC) or a
        Supplemental Statement of the Case (SSOC): By submitting this form, you
        agree to participate in the current decision review process for the
        issues you’ve requested a Higher-Level Review for, and which were
        decided in a SOC or SSOC. You’re withdrawing the eligible legacy appeal
        issue(s) you’ve selected in this request in their entirety, and any
        associated hearing requests, and opting for the issues to be decided in
        the current decision review process. You acknowledge that you can’t
        return to the legacy appeals system for the issue(s) withdrawn.
      </div>
    </va-additional-info>
  </>
);
