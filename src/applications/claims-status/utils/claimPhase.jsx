import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const getClaimPhases = date => {
  return [
    {
      phase: 1,
      header: 'Step 1: Claim received',
      description: (
        <>
          <p className="vads-u-margin-y--0">
            We started working on your claim on {date}
          </p>
        </>
      ),
    },
    {
      phase: 2,
      header: 'Step 2: Initial review',
      description: (
        <>
          <p className="vads-u-margin-top--0">
            We’ll check your claim for basic information we need, like your name
            and Social Security number.
          </p>
          <p className="vads-u-margin-bottom--0">
            If information is missing, we’ll contact you.
          </p>
        </>
      ),
    },
    {
      phase: 3,
      header: 'Step 3: Evidence gathering',
      description: (
        <>
          <p>
            We’ll review your claim and make sure we have all the evidence and
            information we need. If we need more evidence to decide your claim,
            we may gather it in these ways:
          </p>
          <ul>
            <li>Ask you to submit evidence </li>
            <li>
              Ask you to have a claim exam
              <br />
              <VaLink
                href="/disability/va-claim-exam/"
                text="Learn more about VA claim exams"
                data-testid="learn-more-about-va-claim-exams-link"
              />
            </li>
            <li>
              Request medical records from your private health care provider
            </li>
            <li>Gather evidence from our VA records</li>
          </ul>
          <p>This is usually the longest step in the process.</p>
          <p>
            Note: You can submit evidence at any time. But if you submit
            evidence after this step, your claim will go back to this step for
            review.
          </p>
          <Link data-testid="upload-evidence-link" to="../files">
            Upload your evidence here
          </Link>
        </>
      ),
    },
    {
      phase: 4,
      header: 'Step 4: Evidence review',
      description: (
        <>
          <p>We’ll review all the evidence for your claim.</p>
          <p>
            If we need more evidence or you submit more evidence, your claim
            will go back to Step 3: Evidence gathering.
          </p>
        </>
      ),
    },
    {
      phase: 5,
      header: 'Step 5: Rating',
      description: (
        <>
          <p>We’ll decide your claim and determine your disability rating.</p>
          <p>
            If we need more evidence or you submit more evidence, your claim
            will go back to Step 3: Evidence gathering.
          </p>
        </>
      ),
    },
    {
      phase: 6,
      header: 'Step 6: Preparing decision letter',
      description: (
        <>
          <p>We’ll prepare your decision letter.</p>
          <p>
            If you’re eligible for disability benefits, this letter will include
            your disability rating, the amount of your monthly payments, and the
            date your payments will start.
          </p>
          <p>
            If we need more evidence or you submit more evidence, your claim
            will go back to Step 3: Evidence gathering.
          </p>
        </>
      ),
    },
    {
      phase: 7,
      header: 'Step 7: Final review',
      description: (
        <>
          <p>
            A senior reviewer will do a final review of your claim and the
            decision letter.
          </p>
        </>
      ),
    },
    {
      phase: 8,
      header: 'Step 8: Claim decided',
      description: (
        <>
          <p>
            You’ll be able to view and download your decision letter on the
            status page for this claim.
          </p>
          <Link to="/your-claim-letters">Go to the claim letters page</Link>
          <p>
            We’ll also send you a copy of your decision letter by mail. It
            should arrive within 10 business days, but it may take longer.
          </p>
        </>
      ),
    },
  ];
};

export const getPensionClaimPhases = date => {
  return [
    {
      phase: 1,
      header: 'Step 1: Claim received',
      description: (
        <>
          <p className="vads-u-margin-y--0">
            We received your claim on {date}.
          </p>
        </>
      ),
    },
    {
      phase: 2,
      header: 'Step 2: Initial review',
      description: (
        <>
          <p className="vads-u-margin-top--0">
            We’ll verify you’re eligible for Veterans Pension benefits.
          </p>
          <ul>
            <li>
              If we have questions about your claim, we’ll move to{' '}
              <strong>Step 3: Evidence gathering</strong>
            </li>
            <li>
              If your claim information meets our requirements, we’ll jump ahead
              to <strong>Step 6: Preparing decision letter</strong>
            </li>
          </ul>
        </>
      ),
    },
    {
      phase: 3,
      header: 'Step 3: Evidence gathering',
      description: (
        <>
          <p>
            If we need more evidence to decide your claim, we may gather it in
            these ways:
          </p>
          <ul>
            <li>Ask you to submit evidence </li>
            <li>
              Ask you to have a claim exam
              <br />
              <VaLink
                href="/disability/va-claim-exam/"
                text="Learn more about VA claim exams"
                data-testid="learn-more-about-va-claim-exams-link"
              />
            </li>
            <li>
              Request medical records from your private health care provider
            </li>
            <li>Gather evidence from our VA records</li>
          </ul>
          <p>This is usually the longest step in the process.</p>
          <p>
            You can submit evidence at any time. But if you submit evidence
            after this step, your claim will go back to this step for review.
          </p>
          <Link data-testid="upload-evidence-link" to="../files">
            Upload your evidence here
          </Link>
        </>
      ),
    },
    {
      phase: 4,
      header: 'Step 4: Evidence review',
      description: (
        <>
          <p>We’ll review all the evidence for your claim.</p>
          <p>
            If we need more evidence or you submit more evidence, your claim
            will go back to <strong>Step 3: Evidence gathering.</strong>
          </p>
        </>
      ),
    },
    {
      phase: 5,
      header: 'Step 5: Rating',
      description: (
        <>
          <p>
            After reviewing your claim and evidence, we’ll determine your
            disability rating.
          </p>
          <p>
            If we need more evidence or you submit more evidence, your claim
            will go back to <strong>Step 3: Evidence gathering.</strong>
          </p>
        </>
      ),
    },
    {
      phase: 6,
      header: 'Step 6: Preparing decision letter',
      description: (
        <>
          <p>We’ll prepare your decision letter.</p>
          <p>
            If you’re eligible for disability benefits, this letter may include
            your disability rating, the amount of your monthly payments, and the
            date your payments will start.
          </p>
          <p>
            If we need more evidence or if you submit more evidence, your claim
            will go back to <strong>Step 3: Evidence gathering.</strong>
          </p>
        </>
      ),
    },
    {
      phase: 7,
      header: 'Step 7: Final review',
      description: (
        <>
          <p>
            A senior reviewer will do a final review of your claim and the
            decision letter.
          </p>
        </>
      ),
    },
    {
      phase: 8,
      header: 'Step 8: Claim decided',
      description: (
        <>
          <p>
            You’ll be able to view and download your decision letter on the
            status page for this claim.
          </p>
          <Link to="/your-claim-letters">Go to the claim letters page</Link>
          <p>
            We’ll also send you a copy of your decision letter by mail. It
            should arrive within 10 business days, but it may take longer.
          </p>
        </>
      ),
    },
  ];
};
