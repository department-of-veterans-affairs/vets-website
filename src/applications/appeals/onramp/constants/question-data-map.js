// This file serves to be the source of truth for question text and response text
// to make content edits simpler and keep responses DRY
export const QUESTION_MAP = Object.freeze({
  HOME: 'Welcome to the disability compensation Decision Review tool',
});

// Left side must match routes in constants/index.js (ROUTES)
export const SHORT_NAME_MAP = Object.freeze({
  HOME: 'HOME',
  Q_1_1_CLAIM_DECISION: 'Q_1_1_CLAIM_DECISION',
});

export const RESPONSES = Object.freeze({
  HLR: 'Higher-Level Review Claim',
  IS: 'Initial/Supplemental Claim',
  NO: 'No',
  YES: 'Yes',
});
