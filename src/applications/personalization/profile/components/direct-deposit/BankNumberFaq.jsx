import React from 'react';

export const BankNumberFaq = (
  <va-additional-info
    trigger="Where can I find these numbers?"
    class="vads-u-margin-y--1p5"
  >
    <img
      src="/img/direct-deposit-check-guide.svg"
      alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
      className="vads-u-margin-bottom--1"
    />
    <div>
      <p>
        The bank routing number is the first 9 digits on the bottom left corner
        of a printed check. Your account number is the second set of numbers on
        the bottom of a check, just to the right of the bank routing number.
      </p>
    </div>
    <div>
      <p>If you don’t have a printed check, you can:</p>
      <ul>
        <li key="sign-in">
          Sign in to your online bank account and check your account details, or
        </li>
        <li key="statement">Check your bank statement, or</li>
        <li key="call">Call your bank</li>
      </ul>
    </div>
  </va-additional-info>
);
