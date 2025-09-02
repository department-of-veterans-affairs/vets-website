import React from 'react';
import manifest from '../../../manifest.json';
import { DISABILITY_COMP_CARD, CLAIM_FOR_INCREASE_CARD } from './cards';
import { DIVIDED_BENES, NON_DR_HEADING, PRINT_OR_RESTART } from '../common';

export const NON_DR_RESULTS_CONTENT = Object.freeze({
  RESULTS_1_1B: {
    h1: NON_DR_HEADING,
    bodyContent: (
      <>
        <p>
          Based on your answers, a decision review may not be available because
          you haven’t filed an initial claim for this condition.
        </p>
        <p className="vads-u-margin-bottom--3">
          VA can only review decisions that have already been made. To move
          forward, you’ll need to file an initial claim first.
        </p>
        {DISABILITY_COMP_CARD(
          `This may be a good fit because you haven’t filed a claim yet.`,
        )}
        {PRINT_OR_RESTART}
      </>
    ),
  },
  RESULTS_1_1C: {
    h1: NON_DR_HEADING,
    bodyContent: (
      <>
        <p>
          Based on your answers, a decision review may not be available because:
        </p>
        <ul>
          <li>
            You’ve submitted a claim, <strong>and</strong>
          </li>
          <li>You haven’t received a decision</li>
        </ul>
        <p>
          Once you get your decision letter, you’ll be able to request a
          decision review.
        </p>
        <va-link-action
          href="/claim-or-appeal-status"
          text="Check status in Claim Status Tool"
        />
        <p>
          You can still use this guide to learn about your options and see what
          might apply once you get your decision letter.
        </p>
        <va-link href={manifest.rootUrl} text="Restart the guide" />
        {DIVIDED_BENES}
        {PRINT_OR_RESTART}
      </>
    ),
  },
  RESULTS_1_3B: {
    h1: NON_DR_HEADING,
    bodyContent: (
      <>
        <p>
          Based on your answers, a decision review may not be available because:
        </p>
        <ul>
          <li>
            Your claim is contested, <strong>and</strong>
          </li>
          <li>It’s been more than 60 days since your decision</li>
        </ul>
        <p>But you may have other options, depending on your situation:</p>
        {DIVIDED_BENES}
        <h2 className="vads-u-margin-top--3">
          If you’re seeking benefits related to a deceased Veteran
        </h2>
        <p>You may need to apply for a different benefit, such as:</p>
        <ul>
          <li>Dependency and Indemnity Compensation (DIC)</li>
          <li>Substitution of claimant</li>
          <li>Death pension</li>
          <li>Burial or memorial benefits</li>
        </ul>
        <p>Each of these benefit types follows a different process.</p>
        <va-link
          href="/family-and-caregiver-benefits/survivor-compensation/dependency-indemnity-compensation"
          text="Learn how to apply for survivor and dependent compensation"
        />
        {PRINT_OR_RESTART}
      </>
    ),
  },
  RESULTS_1_2_C1: {
    h1: NON_DR_HEADING,
    bodyContent: (
      <>
        <p>
          Based on your answers, your claim is no longer eligible for a decision
          review because:
        </p>
        <ul>
          <li>
            You don’t have any new and relevant evidence, <strong>and</strong>
          </li>
          <li>VA made a decision on your claim more than 1 year ago</li>
        </ul>
        <p>But you may have other options, depending on your situation:</p>
        {DISABILITY_COMP_CARD(
          `This may be a good fit because your claim is no longer eligible for a decision review.`,
        )}
        {PRINT_OR_RESTART}
      </>
    ),
  },
  RESULTS_2_IS_3: {
    h1: NON_DR_HEADING,
    bodyContent: (
      <>
        <p>
          Based on your answers, you may be eligible to apply for more
          disability compensation.
        </p>
        {CLAIM_FOR_INCREASE_CARD}
        {PRINT_OR_RESTART}
      </>
    ),
  },
});
