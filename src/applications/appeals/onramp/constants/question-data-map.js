// This file serves to be the source of truth for question text and response text
// to make content edits simpler and keep responses DRY
import React from 'react';

// Left side must match routes in constants/index.js (ROUTES)
export const SHORT_NAME_MAP = Object.freeze({
  Q_1_1_CLAIM_DECISION: 'Q_1_1_CLAIM_DECISION',
  Q_1_1A_SUBMITTED_526: 'Q_1_1A_SUBMITTED_526',
  Q_1_2_CLAIM_DECISION: 'Q_1_2_CLAIM_DECISION',
  Q_1_2A_1_SERVICE_CONNECTED: 'Q_1_2A_1_SERVICE_CONNECTED',
  Q_1_2A_CONDITION_WORSENED: 'Q_1_2A_CONDITION_WORSENED',
  Q_1_2A_2_DISAGREE_DECISION: 'Q_1_2A_2_DISAGREE_DECISION',
  Q_1_2B_LAW_POLICY_CHANGE: 'Q_1_2B_LAW_POLICY_CHANGE',
  Q_1_2C_NEW_EVIDENCE: 'Q_1_2C_NEW_EVIDENCE',
  Q_1_3_CLAIM_CONTESTED: 'Q_1_3_CLAIM_CONTESTED',
  Q_1_3A_FEWER_60_DAYS: 'Q_1_3A_FEWER_60_DAYS',
  Q_2_IS_1_SERVICE_CONNECTED: 'Q_2_IS_1_SERVICE_CONNECTED',
  Q_2_IS_2_CONDITION_WORSENED: 'Q_2_IS_2_CONDITION_WORSENED',
  Q_2_IS_4_DISAGREE_DECISION: 'Q_2_IS_4_DISAGREE_DECISION',
  Q_2_0_CLAIM_TYPE: 'Q_2_0_CLAIM_TYPE',
  Q_2_IS_1A_LAW_POLICY_CHANGE: 'Q_2_IS_1A_LAW_POLICY_CHANGE',
  Q_2_IS_1B_NEW_EVIDENCE: 'Q_2_IS_1B_NEW_EVIDENCE',
  Q_2_IS_1B_2_JUDGE_HEARING: 'Q_2_IS_1B_2_JUDGE_HEARING',
  Q_2_IS_1B_3_JUDGE_HEARING: 'Q_2_IS_1B_3_JUDGE_HEARING',
  Q_2_S_1_NEW_EVIDENCE: 'Q_2_S_1_NEW_EVIDENCE',
  Q_2_S_2_WITHIN_120_DAYS: 'Q_2_S_2_WITHIN_120_DAYS',
  Q_2_H_2_NEW_EVIDENCE: 'Q_2_H_2_NEW_EVIDENCE',
  Q_2_H_2A_JUDGE_HEARING: 'Q_2_H_2A_JUDGE_HEARING',
  Q_2_H_2B_JUDGE_HEARING: 'Q_2_H_2B_JUDGE_HEARING',
});

export const RESPONSES = Object.freeze({
  BOARD: 'Board decision',
  CFI: 'Claim for increase',
  HLR: 'Higher-Level Review',
  INIT: 'Initial claim',
  NO: 'No',
  SC: 'Supplemental claim',
  YES: 'Yes',
});

const { BOARD, CFI, HLR, INIT, NO, SC, YES } = RESPONSES;

const NEW_AND_RELEVANT_EVIDENCE = {
  descriptionText: (
    <>
      <p>
        Supporting evidence could be documents, medical records, or other
        information. The evidence should be:
      </p>
      <ul>
        <li>
          Information we haven’t considered before, <strong>and</strong>
        </li>
        <li>Help prove or disprove an issue in your claim</li>
      </ul>
      <p>
        You can submit this evidence yourself or identify records you’d like us
        to obtain for you.
      </p>
    </>
  ),
  h1: `New and relevant evidence`,
  hintText: null,
  questionText: `Do you have new and relevant evidence?`,
  responses: [
    { [YES]: `I have new and relevant evidence to submit.` },
    { [NO]: `I don’t have any new and relevant evidence.` },
  ],
};

const LAW_POLICY_CHANGE = {
  descriptionText: (
    <>
      <p>
        This could include new laws, court decisions, or VA policy updates that
        affect how claims are decided. Examples of a change in law or policy
        might include:
      </p>
      <ul className="vads-u-margin-bottom--3">
        <li>
          A court ruling that changes how a condition is evaluated,{' '}
          <strong>or</strong>
        </li>
        <li>
          A new law that adds eligibility for certain conditions,{' '}
          <strong>or</strong>
        </li>
        <li>
          Updates to how we review specific types of claims (like toxic exposure
          or presumptive conditions, such as those covered under the PACT Act)
        </li>
      </ul>
      <va-link
        external
        href="/resources/the-pact-act-and-your-va-benefits"
        text="Learn how the PACT Act may affect your VA benefits and care"
      />
    </>
  ),
  h1: `Change in law or policy`,
  hintText: null,
  questionText: `Are you requesting a review because of a change in law or policy?`,
  responses: [
    { [YES]: `I want a review because of a change in law or policy.` },
    { [NO]: `I want a review for a different reason.` },
  ],
};

const CONDITION_WORSENED = {
  descriptionText: null,
  h1: `Condition worsened`,
  hintText: null,
  questionText: `Has your service-connected condition gotten worse since you filed this claim?`,
  responses: [
    { [YES]: `My service-connected condition has gotten worse.` },
    { [NO]: `My service-connected condition hasn’t gotten worse.` },
  ],
};

const JUDGE_HEARING = {
  descriptionText: (
    <>
      <p>
        This is a virtual or in-person hearing where you can speak directly with
        a Veterans Law Judge about your case. You can also submit new evidence
        during or after the hearing.
      </p>
      <p>
        A decision for a virtual or in-person hearing usually takes about 730
        days (2 years) on average.
      </p>
      <p>
        If you prefer not to have a hearing, a Veterans Law Judge can review
        your claim and make a decision based only on the information in your
        file and any new evidence you submit now.
      </p>
      <p>
        This type of review, conducted without a virtual or in-person hearing,
        typically takes about 365 days (1 year) on average.
      </p>
      <p>
        If we grant your benefits, your payments will be backdated to the date
        your request was received.
      </p>
    </>
  ),
  h1: `Hearing with a Veterans Law Judge`,
  hintText: null,
  questionText: `Do you want to have a hearing with a Veterans Law Judge?`,
  responses: [
    { [YES]: `I want a hearing with a Veterans Law Judge.` },
    {
      [NO]: `A Veterans Law Judge can review my claim and make a decision without a hearing.`,
    },
  ],
};

const SERVICE_CONNECTED = {
  descriptionText: (
    <>
      <p>
        A service-connected condition is a disability or illness that was
        caused—or made worse—by your military service. This could mean:
      </p>
      <ul>
        <li>
          You got the condition during active duty, <strong>or</strong>
        </li>
        <li>
          A condition you already had got worse because of your service,{' '}
          <strong>or</strong>
        </li>
        <li>
          You developed the condition after service because of something that
          happened during your service (like toxic exposure or presumptive
          conditions, such as those covered under the PACT Act)
        </li>
      </ul>
      <va-link
        external
        href="/disability/eligibility"
        text="Learn more about service-connected conditions"
      />
    </>
  ),
  h1: `Service-connected condition`,
  hintText: null,
  questionText: `Did we decide that your condition is service connected?`,
  responses: [
    { [YES]: `VA said my condition is service connected.` },
    { [NO]: `VA said my condition isn’t service connected.` },
  ],
};

const DISAGREE_DECISION = {
  descriptionText: (
    <>
      <p>You might disagree with 1 or more of these things from your claim:</p>
      <ul>
        <li>
          Your disability rating (how we rated the severity of your condition)
        </li>
        <li>Whether your condition is service-connected</li>
        <li>The effective date (when your benefits eligibility started)</li>
      </ul>
      <va-link
        external
        href="/disability/effective-date"
        text="Learn more about disability compensation effective dates"
      />
    </>
  ),
  h1: `Disagreement with decision`,
  hintText: null,
  questionText: `Do you disagree with any part of our decision?`,
  responses: [
    { [YES]: `I disagree with part of the decision.` },
    { [NO]: `I only want to report that my condition has gotten worse.` },
  ],
};

export const get120DayDeadline = () => {
  const now = new Date();
  const currentUTCDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const date120DaysAgo = new Date(
    currentUTCDate.getTime() - 120 * 24 * 60 * 60 * 1000,
  );

  return date120DaysAgo.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

export const QUESTION_CONTENT = Object.freeze({
  INTRODUCTION: {
    h1: `Explore disability claim decision review options`,
  },
  Q_1_1_CLAIM_DECISION: {
    descriptionText: (
      <>
        <p className="vads-u-margin-top--0">
          This could be about a decision on 1 or more issues from your
          disability claim, such as:
        </p>
        <ul>
          <li>An initial claim</li>
          <li>A claim for increase</li>
          <li>A Supplemental Claim</li>
          <li>A Higher-Level Review</li>
          <li>A Board Appeal decision</li>
        </ul>
      </>
    ),
    h1: `Decision status`,
    hintText: null,
    questionText: `Have we sent you a decision on your claim yet?`,
    responses: [
      {
        [YES]: `I've received a decision for the issue I want to review.`,
      },
      { [NO]: `I haven't received a decision for the issue yet.` },
    ],
  },
  Q_1_1A_SUBMITTED_526: {
    descriptionText: (
      <p className="vads-u-margin-top--0">
        This means you submitted VA Form 21-526EZ to apply for disability
        compensation.
      </p>
    ),
    h1: `Disability claim filed`,
    hintText: null,
    questionText: `Have you filed a disability claim for this condition?`,
    responses: [
      { [YES]: `I filed a claim for this condition.` },
      { [NO]: `I haven't filed a claim for this condition yet.` },
    ],
  },
  Q_1_2_CLAIM_DECISION: {
    descriptionText: null,
    h1: `Claim decision timeline`,
    hintText: null,
    questionText: `Was your claim decided less than a year ago?`,
    responses: [
      { [YES]: `My claim was decided less than a year ago.` },
      { [NO]: `My claim was decided over a year ago.` },
    ],
  },
  Q_1_2A_1_SERVICE_CONNECTED: {
    ...SERVICE_CONNECTED,
  },
  Q_1_2A_CONDITION_WORSENED: {
    ...CONDITION_WORSENED,
  },
  Q_1_2A_2_DISAGREE_DECISION: {
    ...DISAGREE_DECISION,
  },
  Q_1_2B_LAW_POLICY_CHANGE: {
    ...LAW_POLICY_CHANGE,
  },
  Q_1_2C_NEW_EVIDENCE: {
    ...NEW_AND_RELEVANT_EVIDENCE,
  },
  Q_1_3_CLAIM_CONTESTED: {
    descriptionText: (
      <>
        <p>
          This means there’s a dispute about your claim—like disagreements about
          attorney fees, or someone else (like a former spouse or dependent)
          claiming the same benefit.
        </p>
        <p>
          Contested claims are rare. We would have sent you a letter to let you
          know.
        </p>
        <va-link
          external
          href="/decision-reviews/contested-claims"
          text="Learn more about contested claims"
        />
      </>
    ),
    h1: `Contested claim`,
    hintText: null,
    questionText: `Is your claim contested?`,
    responses: [
      { [YES]: `My claim is contested.` },
      { [NO]: `My claim is not contested.` },
    ],
  },
  Q_1_3A_FEWER_60_DAYS: {
    descriptionText: null,
    h1: `Date on decision`,
    hintText: null,
    questionText: `Has it been fewer than 60 days since the date on your decision?`,
    responses: [
      { [YES]: `It’s been fewer than 60 days.` },
      { [NO]: `It’s been more than 60 days.` },
    ],
  },
  Q_2_IS_1_SERVICE_CONNECTED: {
    ...SERVICE_CONNECTED,
  },
  Q_2_IS_2_CONDITION_WORSENED: {
    ...CONDITION_WORSENED,
  },
  Q_2_IS_4_DISAGREE_DECISION: {
    ...DISAGREE_DECISION,
  },
  Q_2_0_CLAIM_TYPE: {
    h1: `Claim type`,
    hintText: null,
    questionText: `What type of claim or appeal decision do you disagree with?`,
    responses: [
      {
        [INIT]: `I filed an initial claim for a new condition and I disagree with the decision.`,
      },
      {
        [CFI]: `I filed an initial claim for a condition that got worse and I disagree with the decision.`,
      },
      {
        [SC]: `I filed a Supplemental Claim (with new evidence or due to a change in law or policy) and I disagree with the decision.`,
      },
      {
        [HLR]: `I requested a Higher-Level Review (a senior reviewer reviewed my previous claim) and I disagree with the decision.`,
      },
      {
        [BOARD]: `I requested a Board Appeal (a Veterans Law Judge at the Board of Veterans’ Appeals reviewed my case) and I disagree with the decision.`,
      },
    ],
  },
  Q_2_IS_1A_LAW_POLICY_CHANGE: {
    ...LAW_POLICY_CHANGE,
  },
  Q_2_IS_1B_NEW_EVIDENCE: {
    ...NEW_AND_RELEVANT_EVIDENCE,
  },
  Q_2_IS_1B_2_JUDGE_HEARING: {
    ...JUDGE_HEARING,
  },
  Q_2_IS_1B_3_JUDGE_HEARING: {
    ...JUDGE_HEARING,
  },
  Q_2_S_1_NEW_EVIDENCE: {
    ...NEW_AND_RELEVANT_EVIDENCE,
  },
  Q_2_S_2_WITHIN_120_DAYS: {
    descriptionText: (
      <p>
        To be eligible for some options, you must have received your decision
        within the last 120 days. This means your decision must be dated on or
        after {get120DayDeadline()}.
      </p>
    ),
    h1: `Board decision timeline`,
    hintText: null,
    questionText: `Did you receive your decision within the last 120 days?`,
    responses: [
      { [YES]: `I received my decision on or after ${get120DayDeadline()}.` },
      { [NO]: `I received a Board decision before ${get120DayDeadline()}.` },
    ],
  },
  Q_2_H_2_NEW_EVIDENCE: {
    ...NEW_AND_RELEVANT_EVIDENCE,
  },
  Q_2_H_2A_JUDGE_HEARING: {
    ...JUDGE_HEARING,
  },
  Q_2_H_2B_JUDGE_HEARING: {
    ...JUDGE_HEARING,
  },
});
