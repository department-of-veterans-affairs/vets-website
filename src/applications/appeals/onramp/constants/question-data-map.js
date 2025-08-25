// This file serves to be the source of truth for question text and response text
// to make content edits simpler and keep responses DRY
import React from 'react';

// Left side must match routes in constants/index.js (ROUTES)
export const SHORT_NAME_MAP = Object.freeze({
  Q_1_1_CLAIM_DECISION: 'Q_1_1_CLAIM_DECISION',
  Q_1_1A_SUBMITTED_526: 'Q_1_1A_SUBMITTED_526',
  Q_1_2_CLAIM_DECISION: 'Q_1_2_CLAIM_DECISION',
  Q_1_2A_CONDITION_WORSENED: 'Q_1_2A_CONDITION_WORSENED',
  Q_1_2B_LAW_POLICY_CHANGE: 'Q_1_2B_LAW_POLICY_CHANGE',
  Q_1_2C_NEW_EVIDENCE: 'Q_1_2C_NEW_EVIDENCE',
  Q_1_3_CLAIM_CONTESTED: 'Q_1_3_CLAIM_CONTESTED',
  Q_1_3A_FEWER_60_DAYS: 'Q_1_3A_FEWER_60_DAYS',
  Q_2_0_CLAIM_TYPE: 'Q_2_0_CLAIM_TYPE',
  Q_2_IS_1_SERVICE_CONNECTED: 'Q_2_IS_1_SERVICE_CONNECTED',
  Q_2_IS_2_CONDITION_WORSENED: 'Q_2_IS_2_CONDITION_WORSENED',
  Q_2_IS_1A_LAW_POLICY_CHANGE: 'Q_2_IS_1A_LAW_POLICY_CHANGE',
  Q_2_IS_1B_NEW_EVIDENCE: 'Q_2_IS_1B_NEW_EVIDENCE',
  Q_2_S_1_NEW_EVIDENCE: 'Q_2_S_1_NEW_EVIDENCE',
  Q_2_H_1_EXISTING_BOARD_APPEAL: 'Q_2_H_1_EXISTING_BOARD_APPEAL',
  Q_2_H_2_NEW_EVIDENCE: 'Q_2_H_2_NEW_EVIDENCE',
  Q_2_H_2A_JUDGE_HEARING: 'Q_2_H_2A_JUDGE_HEARING',
  Q_2_H_2B_JUDGE_HEARING: 'Q_2_H_2B_JUDGE_HEARING',
});

export const RESPONSES = Object.freeze({
  BOARD: 'Board Appeal',
  HLR: 'Higher-Level Review decision',
  INIT: 'Initial claim or claim for increase',
  NO: 'No',
  SC: 'Supplemental claim',
  YES: 'Yes',
});

const { BOARD, HLR, INIT, NO, SC, YES } = RESPONSES;

const NEW_AND_RELEVANT_EVIDENCE = {
  descriptionText: (
    <>
      <p>
        New and relevant evidence could be any documents, medical records, or
        other information that VA hasn’t seen before and that could help us
        decide on your claim. These documents should be:
      </p>
      <ul>
        <li>
          Evidence the VA hasn’t considered before for this claim,{' '}
          <strong>and</strong>
        </li>
        <li>Information that proves or disproves something in your claim</li>
      </ul>
    </>
  ),
  h1: `New and relevant evidence`,
  hintText: null,
  questionText: `Do you have new evidence that VA hasn't seen yet and that could be relevant to your claim?`,
  responses: [
    { [YES]: `I have new and relevant evidence to submit` },
    { [NO]: `I don’t have any new and relevant evidence` },
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
          Updates to how VA reviews specific types of claims (like toxic
          exposure or presumptive conditions, such as those covered under the
          PACT Act)
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
    { [YES]: `I want a review because of a change in law or policy` },
    { [NO]: `I’m requesting a review for a different reason` },
  ],
};

const CONDITION_WORSENED = {
  descriptionText: null,
  h1: `Condition worsening`,
  hintText: null,
  questionText: `Has your service-connected condition gotten worse since you filed this claim?`,
  responses: [
    { [YES]: `My condition has gotten worse` },
    { [NO]: `I disagree with the decision, but my condition hasn’t changed` },
  ],
};

const JUDGE_HEARING = {
  descriptionText: (
    <>
      <p>
        This is a live virtual or in-person hearing where you can speak directly
        with a Veterans Law Judge about your case. You can also submit new
        evidence during or after the hearing.
      </p>
      <p>
        A decision for a live virtual or in-person hearing usually takes about
        730 days (2 years) on average.
      </p>
      <p>
        If you prefer not to have a hearing, a Veterans Law Judge can review
        your claim and make a decision based only on the information in your
        file and any new evidence you submit now.
      </p>
      <p>
        This type of review, conducted without a live hearing, typically takes
        about 365 days (1 year) on average.
      </p>
      <p>
        If VA grants your benefits, your payments will be backdated to the date
        your request was received.
      </p>
    </>
  ),
  h1: `Hearing with a Veterans Law Judge`,
  hintText: null,
  questionText: `Do you want to have a hearing with a Veterans Law Judge?`,
  responses: [
    { [YES]: `I want a hearing with a Veterans Law Judge` },
    {
      [NO]: `A Veterans Law Judge can review my claim and make a decision without a hearing`,
    },
  ],
};

export const QUESTION_CONTENT = Object.freeze({
  INTRODUCTION: {
    h1: `Welcome to the disability compensation Decision Review tool`,
  },
  Q_1_1_CLAIM_DECISION: {
    descriptionText: null,
    h1: `VA claim decision`,
    hintText: null,
    questionText: `Has VA made a decision on the condition or part of your claim for which you'd like to request a review or appeal?`,
    responses: [
      {
        [YES]: `I've received a decision letter for the issue I want to review`,
      },
      { [NO]: `I haven't received a decision letter for the issue yet` },
    ],
  },
  Q_1_1A_SUBMITTED_526: {
    descriptionText: null,
    h1: `Filing a disability claim`,
    hintText: `This means you submitted VA Form 21-526EZ to apply for disability compensation.`,
    questionText: `Have you filed a disability claim for this condition?`,
    responses: [
      { [YES]: `I filed a claim for this condition` },
      { [NO]: `I haven't filed a claim for this condition yet` },
    ],
  },
  Q_1_2_CLAIM_DECISION: {
    descriptionText: null,
    h1: `VA claim decision timeline`,
    hintText: null,
    questionText: `Was your claim decided less than a year ago?`,
    responses: [
      { [YES]: `My claim was decided less than a year ago` },
      { [NO]: `My claim was decided over a year ago` },
    ],
  },
  Q_1_2A_CONDITION_WORSENED: {
    ...CONDITION_WORSENED,
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
          This means someone else, like a previous spouse or a dependent, is
          also trying to claim the same benefit. Contested claims are rare. VA
          would have sent you a letter to let you know.
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
    questionText: `Is the claim you want us to review contested?`,
    responses: [
      { [YES]: `My claim is contested` },
      { [NO]: `My claim is not contested` },
    ],
  },
  Q_1_3A_FEWER_60_DAYS: {
    descriptionText: null,
    h1: `Date on decision letter`,
    hintText: null,
    questionText: `Has it been fewer than 60 days since the date on your decision letter?`,
    responses: [
      { [YES]: `It’s been fewer than 60 days` },
      { [NO]: `It’s been more than 60 days` },
    ],
  },
  Q_2_0_CLAIM_TYPE: {
    h1: `Claim type`,
    hintText: null,
    questionText: `What type of claim decision is the one you want us to review?`,
    responses: [
      {
        [INIT]: `I filed a disability claim using VA Form 21-526EZ for a new condition or to increase my disability rating for a condition that got worse`,
      },
      { [SC]: `I submitted new evidence after a previous decision` },
      { [HLR]: `A senior reviewer reviewed my previous claim decision` },
      {
        [BOARD]: `A Veterans Law Judge at the Board of Veterans’ Appeals reviewed my case`,
      },
    ],
  },
  Q_2_IS_1_SERVICE_CONNECTED: {
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
    h1: `Did VA decide that your condition is service connected?`,
    hintText: null,
    questionText: `Did VA decide that your condition is service connected?`,
    responses: [
      { [YES]: `VA said my condition is service connected` },
      { [NO]: `VA said my condition isn’t service connected` },
    ],
  },
  Q_2_IS_1A_LAW_POLICY_CHANGE: {
    ...LAW_POLICY_CHANGE,
  },
  Q_2_IS_1B_NEW_EVIDENCE: {
    ...NEW_AND_RELEVANT_EVIDENCE,
  },
  Q_2_IS_2_CONDITION_WORSENED: {
    ...CONDITION_WORSENED,
  },
  Q_2_S_1_NEW_EVIDENCE: {
    ...NEW_AND_RELEVANT_EVIDENCE,
  },
  Q_2_H_1_EXISTING_BOARD_APPEAL: {
    descriptionText: (
      <>
        <p>
          This means a Veterans Law Judge at the Board of Veterans’ Appeals
          reviewed your case and issued a decision.
        </p>
        <p>
          You can’t request a Higher-Level Review for a claim that’s already
          been decided by the Board.
        </p>
      </>
    ),
    h1: `Previous Board Appeal`,
    hintText: null,
    questionText: `Have you already had a Board Appeal for this claim?`,
    responses: [
      { [YES]: `A Veterans Law Judge already reviewed and decided my claim` },
      { [NO]: `This claim hasn’t been reviewed by the Board` },
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
