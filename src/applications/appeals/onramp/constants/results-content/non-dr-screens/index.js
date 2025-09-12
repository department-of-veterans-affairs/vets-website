import React from 'react';
import manifest from '../../../manifest.json';
import { resultsNonDRDynamicContentDCs } from '../../display-conditions/results-dynamic-content';
import { DISABILITY_COMP_CARD } from './cards';
import {
  CLAIM_FOR_INCREASE_CARD,
  CONDITION_HAS_WORSENED_INFO,
  COURT_OF_APPEALS,
  DIVIDED_BENES,
  GET_GUIDANCE,
  HORIZ_RULE,
  NON_DR_HEADING,
  PRINT_OR_RESTART,
} from '../common';
import { displayConditionsMet } from '../../../utilities/display-conditions';
import { renderSingleOrList } from '../../../utilities';
import { PAGE_CONTENT_RESULTS_1_2D } from './dynamic-page-content';

// Used for Results 1.2.D which is the only non-DR results page with dynamic content
export const getDynamicPageContent = formResponses => {
  const toDisplay = PAGE_CONTENT_RESULTS_1_2D.filter(content => {
    // We specifically pull in the Non-DR chunk of dynamic content display conditions
    // because some of the text content is identical to the DR content and we have
    // different display conditions
    const itemDCs = resultsNonDRDynamicContentDCs?.[content] || {};

    if (displayConditionsMet(formResponses, itemDCs)) {
      return content;
    }

    return null;
  });

  if (!toDisplay.length) return null;

  return renderSingleOrList(
    toDisplay,
    true,
    null,
    null,
    'page-dynamic-content',
  );
};

const RESULTS_2_S_3_CONTENT = Object.freeze([
  `You don’t have new or relevant evidence, which is required to
              submit a Supplemental Claim`,
  `You can’t request a Higher-Level review of a Board decision`,
  `You can’t request a Board review of a Board decision`,
]);

const RESULTS_2_S_3_1_CONTENT = RESULTS_2_S_3_CONTENT;

const RESULTS_2_S_4_CONTENT = Object.freeze([
  ...RESULTS_2_S_3_CONTENT,
  `We made a decision on your claim more than 120 days ago`,
]);

const RESULTS_2_S_4_1_CONTENT = RESULTS_2_S_4_CONTENT;

const NO_LONGER_ELIGIBLE = `Based on your answers, your claim may no longer be eligible for a
            decision review because:`;
const MAY_HAVE_OTHER_OPTIONS = `But you may have other options, depending on your situation:`;

export const NON_DR_RESULTS_CONTENT = formResponses =>
  Object.freeze({
    RESULTS_1_1B: {
      h1: NON_DR_HEADING,
      bodyContent: (
        <>
          <p>
            Based on your answers, a decision review may not be available
            because you haven’t filed an initial claim for this condition.
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
            Based on your answers, a decision review may not be available
            because:
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
            You can still use this guide to learn about your options and see
            what might apply once you get your decision letter.
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
            Based on your answers, a decision review may not be available
            because:
          </p>
          <ul>
            <li>
              Your claim is contested, <strong>and</strong>
            </li>
            <li>It’s been more than 60 days since your decision</li>
          </ul>
          <p>{MAY_HAVE_OTHER_OPTIONS}</p>
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
    RESULTS_1_2D: {
      h1: NON_DR_HEADING,
      bodyContent: (
        <>
          <p>{NO_LONGER_ELIGIBLE}</p>
          {getDynamicPageContent(formResponses)}
          <p>However, you may still have other options available to you.</p>
          {GET_GUIDANCE}
          {HORIZ_RULE}
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
          {CLAIM_FOR_INCREASE_CARD()}
          {PRINT_OR_RESTART}
        </>
      ),
    },
    RESULTS_2_S_3: {
      h1: NON_DR_HEADING,
      bodyContent: (
        <>
          <p>{NO_LONGER_ELIGIBLE}</p>
          {renderSingleOrList(
            RESULTS_2_S_3_CONTENT,
            true,
            null,
            null,
            'results-2-s-3-content',
          )}
          <p>{MAY_HAVE_OTHER_OPTIONS}</p>
          {/* Adding a `role="list"` to `ul` with `list-style: none` to work around
            a problem with Safari not treating the `ul` as a list. */}
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul className="onramp-list-none" role="list">
            <li>{COURT_OF_APPEALS}</li>
          </ul>
          {GET_GUIDANCE}
          {HORIZ_RULE}
          {PRINT_OR_RESTART}
        </>
      ),
    },
    RESULTS_2_S_3_1: {
      h1: NON_DR_HEADING,
      bodyContent: (
        <>
          <p>{NO_LONGER_ELIGIBLE}</p>
          {renderSingleOrList(
            RESULTS_2_S_3_1_CONTENT,
            true,
            null,
            null,
            'results-2-s-3-1-content',
          )}
          <p>{MAY_HAVE_OTHER_OPTIONS}</p>
          {COURT_OF_APPEALS}
          {CONDITION_HAS_WORSENED_INFO}
          {CLAIM_FOR_INCREASE_CARD(true)}
          {GET_GUIDANCE}
          {HORIZ_RULE}
          {PRINT_OR_RESTART}
        </>
      ),
    },
    RESULTS_2_S_4: {
      h1: NON_DR_HEADING,
      bodyContent: (
        <>
          <p>{NO_LONGER_ELIGIBLE}</p>
          {renderSingleOrList(
            RESULTS_2_S_4_CONTENT,
            true,
            null,
            null,
            'results-2-s-4-content',
          )}
          <p>However, you may still have other options available to you.</p>
          {GET_GUIDANCE}
          {HORIZ_RULE}
          {PRINT_OR_RESTART}
        </>
      ),
    },
    RESULTS_2_S_4_1: {
      h1: NON_DR_HEADING,
      bodyContent: (
        <>
          <p>{NO_LONGER_ELIGIBLE}</p>
          {renderSingleOrList(
            RESULTS_2_S_4_1_CONTENT,
            true,
            null,
            null,
            'results-2-s-4-1-content',
          )}
          <p>
            But you may be eligible to apply for more disability compensation.
          </p>
          {CLAIM_FOR_INCREASE_CARD()}
          {GET_GUIDANCE}
          {HORIZ_RULE}
          {PRINT_OR_RESTART}
        </>
      ),
    },
  });
