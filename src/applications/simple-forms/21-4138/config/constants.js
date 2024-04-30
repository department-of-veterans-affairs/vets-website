import React from 'react';

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
  PRIORITY_PROCESSING: 'priority-processing',
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
  [STATEMENT_TYPES.PRIORITY_PROCESSING]:
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

export const LIVING_SITUATIONS = Object.freeze({
  OVERNIGHT:
    'I live or sleep overnight in a place that isn’t meant for regular sleeping. This includes a car, park, abandoned building, bus station, train station, airport, or camping ground.',
  SHELTER:
    'I live in a shelter (including a hotel or motel) that’s meant for temporary stays.',
  FRIEND_OR_FAMILY:
    'I’m staying with a friend or family member, because I can’t get my own home right now.',
  LEAVING_SHELTER:
    'In the next 30 days, I will have to leave a facility, like a homeless shelter.',
  LOSING_HOME:
    'In the next 30 days, I will lose my home. (Note: This could include a house, apartment, trailer, or other living space that you own, rent, or live in without paying rent. Or it could include a living space that you share with others. It could also include rooms in hotels or motels.)',
  OTHER_RISK: 'I have another housing risk not listed here.',
  NONE: 'None of these situations apply to me.',
});

export const ADDITIONAL_INFO_OTHER_HOUSING_RISKS = Object.freeze(
  <va-additional-info
    trigger="What to know before sharing details about other housing risks"
    data-testid="otherHousingRisksAdditionalInfo"
  >
    <div>
      <p>
        We understand that you may have other housing risks not listed here. If
        you feel comfortable sharing more about your situation, you can do that
        here. Or you can simply check this option and not include any details.
        We’ll use this information only to prioritize your request.
      </p>
      <p>
        <b>Note:</b> If you need help because of domestic violence, call the
        National Domestic Violence hotline <va-telephone contact="8007997233" />{' '}
        (TTY: <va-telephone contact="8007873224" />) or text "START" to 88788.
        Staff are there to help 24 hours a day, 7 days a week. All conversations
        are private and confidential.
      </p>
    </div>
  </va-additional-info>,
);

export const PRIORITY_PROCESSING_OTHER_REASONS = Object.freeze({
  FINANCIAL_HARDSHIP:
    'I’m experiencing extreme financial hardship (such as loss of your job or sudden decrease in income).',
  ALS:
    'I have ALS (amyotrophic lateral sclerosis), also known as Lou Gehrig’s disease.',
  TERMINAL_ILLNESS: 'I have a terminal illness.',
  VSI_SI:
    'I have a status from the Defense Department of Very Seriously Injured or Ill (VSI) or Seriously Injured or Ill (SI).',
  OVER_85: 'I’m age 85 or older.',
  FORMER_POW: 'I’m a former prisoner of war (POW).',
  MEDAL_AWARD: 'I’m a Medal of Honor or Purple Heart award recipient.',
});

export const PRIORITY_PROCESSING_NOT_QUALIFIED = Object.freeze(
  <div>
    <va-alert>
      Based on your responses, you may not qualify for priority processing.
    </va-alert>
    <p>
      It’s possible we don’t have enough information about your situation yet.
      You may use this form (VA Form 21-4138) to submit a detailed explanation
      about your circumstances.
    </p>
  </div>,
);
