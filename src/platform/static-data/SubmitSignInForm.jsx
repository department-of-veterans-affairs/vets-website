import React from 'react';

export default function SubmitSignInForm({ startSentence }) {
  return (
    <span>
      <a
        href="https://www.accesstocare.va.gov/sign-in-help"
        target="_blank"
        rel="noopener noreferrer"
      >
        {startSentence ? 'Submit' : 'submit'} a request to get help signing in
      </a>
    </span>
  );
}
