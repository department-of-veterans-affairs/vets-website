/** OPTION CARD TITLES / OVERVIEW PANEL LIST ============================================================ */
export const TITLE_SC = 'Supplemental Claim';
export const TITLE_HLR = 'Higher-Level Review';
export const TITLE_BOARD_DIRECT = 'Board Appeal: Direct Review';
export const TITLE_BOARD_EVIDENCE = 'Board Appeal: Evidence Submission';
export const TITLE_BOARD_HEARING = 'Board Appeal: Hearing';
export const TITLE_BOARD = 'Board Appeal';

export const OVERVIEW = Object.freeze([
  TITLE_SC,
  TITLE_HLR,
  TITLE_BOARD_DIRECT,
  TITLE_BOARD_EVIDENCE,
  TITLE_BOARD_HEARING,
]);

/** OPTION CARD "Good Fit" (white cards) CONTENT ========================================================== */
export const CARD_GF_DECISION_OVER_1_YEAR = `Your decision is over 1 year old, so your next option is a Supplemental Claim since other reviews require filing within 1 year`;
export const CARD_GF_REVIEW_HLR = `You’re requesting a review of a Higher-Level Review decision, so your next options are requesting a Board Appeal or a Supplemental Claim`;
export const CARD_GF_REVIEW_SC = `You’re requesting a review of a Supplemental Claim, so your next step could be another Supplemental Claim, a Higher-Level Review, or requesting a Board Appeal`;
export const CARD_GF_REVIEW_BOARD = `You’re requesting a review of a Board decision, so your next option is a Supplemental Claim since you can’t request the other types of reviews on a Board decision`;
export const CARD_GF_REVIEW_INIT = `You’re requesting a review of an initial claim, so your next step could be a Supplemental Claim, a Higher-Level Review,  or requesting a Board Appeal`;
export const CARD_GF_YES_EVIDENCE = `You have new and relevant evidence`;
export const CARD_GF_NO_EVIDENCE = `You don’t have new and relevant evidence`;
export const CARD_GF_YES_LAW_POLICY = `You’re requesting a review based on a change in law or policy`;
export const CARD_GF_NO_LAW_POLICY = `You’re not requesting a review based on a change in law or policy`;
export const CARD_GF_NOT_CONTESTED = `Your claim is not contested`;
export const CARD_GF_BOARD_ONLY_OPTION = `Requesting a Board Appeal review is the only available review option for contested claims`;
export const CARD_GF_YES_HEARING = `You want a hearing with a Veterans Law Judge`;
export const CARD_GF_NO_HEARING = `You don’t want a hearing with a Veterans Law Judge`;

export const CARD_CONTENT_GF_SC = Object.freeze([
  CARD_GF_DECISION_OVER_1_YEAR,
  CARD_GF_REVIEW_HLR,
  CARD_GF_REVIEW_SC,
  CARD_GF_REVIEW_BOARD,
  CARD_GF_REVIEW_INIT,
  CARD_GF_YES_EVIDENCE,
  CARD_GF_YES_LAW_POLICY,
  CARD_GF_NOT_CONTESTED,
  CARD_GF_NO_HEARING,
]);

export const CARD_CONTENT_GF_HLR = Object.freeze([
  CARD_GF_REVIEW_SC,
  CARD_GF_REVIEW_INIT,
  CARD_GF_NO_EVIDENCE,
  CARD_GF_NOT_CONTESTED,
  CARD_GF_NO_LAW_POLICY,
]);

export const CARD_CONTENT_GF_BOARD_DIRECT = Object.freeze([
  CARD_GF_REVIEW_HLR,
  CARD_GF_REVIEW_SC,
  CARD_GF_REVIEW_INIT,
  CARD_GF_NO_EVIDENCE,
  CARD_GF_BOARD_ONLY_OPTION,
  CARD_GF_NO_HEARING,
  CARD_GF_NO_LAW_POLICY,
]);

export const CARD_CONTENT_GF_BOARD_EVIDENCE = Object.freeze([
  CARD_GF_REVIEW_HLR,
  CARD_GF_REVIEW_SC,
  CARD_GF_REVIEW_INIT,
  CARD_GF_YES_EVIDENCE,
  CARD_GF_BOARD_ONLY_OPTION,
  CARD_GF_NO_HEARING,
  CARD_GF_NO_LAW_POLICY,
]);

export const CARD_CONTENT_GF_BOARD_HEARING = Object.freeze([
  CARD_GF_REVIEW_HLR,
  CARD_GF_REVIEW_SC,
  CARD_GF_REVIEW_INIT,
  CARD_GF_YES_EVIDENCE,
  CARD_GF_NO_EVIDENCE,
  CARD_GF_BOARD_ONLY_OPTION,
  CARD_GF_YES_HEARING,
  CARD_GF_NO_LAW_POLICY,
]);

export const LEARN_MORE_SC = {
  text: 'Learn more about Supplemental Claims',
  url: '/decision-reviews/supplemental-claim',
};

export const LEARN_MORE_HLR = {
  text: 'Learn more about Higher-Level Reviews',
  url: '/decision-reviews/higher-level-review',
};

export const LEARN_MORE_BOARD = {
  text: 'Learn more about Board Appeals',
  url: '/decision-reviews/board-appeal',
};

export const START_SC = {
  text: 'Start Supplemental Claim',
  url:
    '/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995/start',
};

export const START_HLR = {
  text: 'Start Higher-Level Review Request',
  url:
    '/decision-reviews/higher-level-review/request-higher-level-review-form-20-0996/start',
};

export const START_BOARD = {
  text: 'Start Board Appeal Request',
  url: '/decision-reviews/board-appeal/request-board-appeal-form-10182/start',
};

export const DECISION_TIMELINES = {
  SC: '79.3 days (roughly 3 months)',
  HLR: '125 days (4 to 5 months)',
  BOARD_DIRECT: '365 days (1 year)',
  BOARD_EVIDENCE: '550 days (1.5 years)',
  BOARD_HEARING: '730 days (2 years)',
};

/** OPTION CARD "Not Good Fit" (gray cards) CONTENT ====================================================== */
export const CARD_NGF_NEED_EVIDENCE = `You need to submit new and relevant evidence to request this type of review`;
export const CARD_NGF_CLAIM_CONTESTED = `Your claim is contested, and this option isn’t available for contested claims`;
export const CARD_NGF_HEARING_NOT_INCLUDED = `You said you want a hearing with a Veterans Law Judge, but this type of review doesn’t include one`;
export const CARD_NGF_HEARING_NOT_DESIRED = `You said you don’t want a hearing with a Veterans Law Judge, but this type of review requires one`;
export const CARD_NGF_HLR_NOT_AVAILABLE = `You're requesting a review of a Higher-Level Review decision, but this option isn't available for that type of review`;
export const CARD_NGF_BOARD_NOT_AVAILABLE = `You're requesting a review of a Board Appeal, but this option isn't available for that type of review`;
export const CARD_NGF_CANNOT_SUBMIT_EVIDENCE = `You can’t submit new and relevant evidence for this type of review`;
export const CARD_NGF_RECEIVED_BOARD_DECISION = `You’ve already received a Board decision for this issue, and you can’t request another for the same claim`;
export const CARD_NGF_YES_LAW_POLICY = `You’re requesting a review based on a change in law or policy, but this review option isn’t for law or policy changes`;
export const CARD_NGF_NO_LAW_POLICY = `You aren’t requesting a review based on a change in law or policy`;
export const CARD_NGF_DECISION_OVER_1_YEAR = `You’re requesting a review of a claim decided over a year ago, but this option requires filing within 1 year`;

export const CARD_CONTENT_NGF_SC = Object.freeze([
  CARD_NGF_NEED_EVIDENCE,
  CARD_NGF_CLAIM_CONTESTED,
  CARD_NGF_NO_LAW_POLICY,
  CARD_NGF_HEARING_NOT_INCLUDED,
]);

export const CARD_CONTENT_NGF_HLR = Object.freeze([
  CARD_NGF_DECISION_OVER_1_YEAR,
  CARD_NGF_HLR_NOT_AVAILABLE,
  CARD_NGF_BOARD_NOT_AVAILABLE,
  CARD_NGF_YES_LAW_POLICY,
  CARD_NGF_CANNOT_SUBMIT_EVIDENCE,
  CARD_NGF_CLAIM_CONTESTED,
  CARD_NGF_HEARING_NOT_INCLUDED,
]);

export const CARD_CONTENT_NGF_BOARD_DIRECT = Object.freeze([
  CARD_NGF_DECISION_OVER_1_YEAR,
  CARD_NGF_RECEIVED_BOARD_DECISION,
  CARD_NGF_YES_LAW_POLICY,
  CARD_NGF_CANNOT_SUBMIT_EVIDENCE,
  CARD_NGF_HEARING_NOT_INCLUDED,
]);

export const CARD_CONTENT_NGF_BOARD_EVIDENCE = Object.freeze([
  CARD_NGF_DECISION_OVER_1_YEAR,
  CARD_NGF_RECEIVED_BOARD_DECISION,
  CARD_NGF_YES_LAW_POLICY,
  CARD_NGF_NEED_EVIDENCE,
  CARD_NGF_HEARING_NOT_INCLUDED,
]);

export const CARD_CONTENT_NGF_BOARD_HEARING = Object.freeze([
  CARD_NGF_DECISION_OVER_1_YEAR,
  CARD_NGF_RECEIVED_BOARD_DECISION,
  CARD_NGF_YES_LAW_POLICY,
  CARD_NGF_HEARING_NOT_DESIRED,
]);

/** OPTION CARD OVERALL (FOR DISPLAY CONDITIONS) ========================================================= */
// For display conditions
export const CARD_SC = 'CARD_SC';
export const CARD_HLR = 'CARD_HLR';
export const CARD_BOARD_DIRECT = 'CARD_BOARD_DIRECT';
export const CARD_BOARD_EVIDENCE = 'CARD_BOARD_EVIDENCE';
export const CARD_BOARD_HEARING = 'CARD_BOARD_HEARING';
export const CARD_COURT_OF_APPEALS = 'CARD_COURT_OF_APPEALS';

export const CARDS = Object.freeze([
  CARD_SC,
  CARD_HLR,
  CARD_BOARD_DIRECT,
  CARD_BOARD_EVIDENCE,
  CARD_BOARD_HEARING,
]);
