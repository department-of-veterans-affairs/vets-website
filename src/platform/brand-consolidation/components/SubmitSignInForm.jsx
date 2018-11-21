import React from 'react';
import isBrandConsolidationEnabled from '../feature-flag';

export default function SubmitSignInForm({ children, startSentence }) {
  if (!isBrandConsolidationEnabled()) {
    return <span>{children}</span>;
  }

  return (
    <span>
      <a
        href="https://www.accesstocare.va.gov/sign-in-help"
        target="_blank"
        rel="noopener"
      >
        {startSentence ? 'Submit' : 'submit'} a request to get help signing in
      </a>
      .
    </span>
  );
}
