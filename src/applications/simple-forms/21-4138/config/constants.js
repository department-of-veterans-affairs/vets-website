export const TITLE = 'Submit a statement to support a claim';
export const SUBTITLE = 'Statement in Support of Claim (VA Form 21-4138)';

export const workInProgressContent = {
  description:
    'We’re rolling out Submit a Statement to Support a Claim (VA Form 21-4138) in stages. It’s not quite ready yet. Please check back again soon.',
  redirectLink: '/',
  redirectText: 'Return to VA home page',
};

export const STATEMENT_TYPES = Object.freeze({
  BUDDY_STATEMENT: 'buddy-statement',
  DECISION_REVIEW: 'decision-review',
  EXPEDITED_CLAIM: 'expedited-claim',
  PERSONAL_RECORDS: 'personal-records',
  NEW_EVIDENCE: 'new-evidence',
  VRE_REQUEST: 'vre-request',
  NOT_LISTED: 'not-listed',
});

export const STATEMENT_TYPE_LABELS = Object.freeze({
  [STATEMENT_TYPES.BUDDY_STATEMENT]:
    'I want to sumbit a formal statement to support my claim or someone else\'s claim. This is also known as a "buddy statement."',
  [STATEMENT_TYPES.DECISION_REVIEW]:
    'I want to request a decision review for my claim.',
  [STATEMENT_TYPES.EXPEDITED_CLAIM]:
    'I want to request that VA process my claim faster due to certain qualifying situations.',
  [STATEMENT_TYPES.PERSONAL_RECORDS]: 'I want to request my personal records.',
  [STATEMENT_TYPES.NEW_EVIDENCE]: 'I have new evidence to submit.',
  [STATEMENT_TYPES.VRE_REQUEST]:
    'I want to submit a request related to the Veteran Readiness and Employment (VR&E) program (Chapter 31).',
  [STATEMENT_TYPES.NOT_LISTED]:
    "The type of statement I want to submit isn't listed here.",
});

export const DECISION_REVIEW_TYPES = Object.freeze({
  NEW_EVIDENCE: 'new-evidence',
  ERROR_MADE: 'error-made',
  BVA_REQUEST: 'bva-request',
});

export const DECISION_REVIEW_TYPE_LABELS = Object.freeze({
  [DECISION_REVIEW_TYPES.NEW_EVIDENCE]: 'I have new and relevant evidence.',
  [DECISION_REVIEW_TYPES.ERROR_MADE]:
    'I think there was an error with a decision on my case.',
  [DECISION_REVIEW_TYPES.BVA_REQUEST]:
    "I want the Board of Veteran's Appeals to review my case.",
});

export const DECISION_REVIEW_TYPE_DESCRIPTIONS = Object.freeze({
  [DECISION_REVIEW_TYPES.ERROR_MADE]:
    "Don't select this option if you have new evidence to submit",
  [DECISION_REVIEW_TYPES.BVA_REQUEST]:
    'You can also submit new evidence with certain types of Board Appeals.',
});
