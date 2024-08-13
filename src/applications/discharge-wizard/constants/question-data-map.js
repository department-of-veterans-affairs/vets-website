export const QUESTION_MAP = Object.freeze({
  HOME: 'How to Apply for a Discharge Upgrade',
  SERVICE_BRANCH: 'What was your branch of service?',
  DISCHARGE_YEAR: 'What year were you discharged from the military?',
  DISCHARGE_MONTH: 'What month were you discharged?',
  REASON: 'Tell us why you want to change your discharge paperwork.',
  DISCHARGE_TYPE: 'Which of the following categories best describes you?',
  INTENTION:
    'Do you want to change your name, discharge date, or something written in the "other remarks" section of your DD214?',
  COURT_MARTIAL: 'Was your discharge the outcome of a general court-martial?',
  PREV_APPLICATION:
    'Have you previously applied for and been denied a discharge upgrade for this period of service?',
  PREV_APPLICATION_TYPE: 'How did you apply for a discharge upgrade last time?',
  PREV_APPLICATION_YEAR: 'What year did you apply for a discharge upgrade?',
  PRIOR_SERVICE:
    'Did you complete a period of service in which your character of service was Honorable or General Under Honorable Conditions?',
  FAILURE_TO_EXHAUST: `Did the board deny your application due to "failure to exhaust other remedies"?`,
});

export const SHORT_NAME_MAP = Object.freeze({
  HOME: 'HOME',
  SERVICE_BRANCH: 'SERVICE_BRANCH',
  DISCHARGE_YEAR: 'DISCHARGE_YEAR',
  DISCHARGE_MONTH: 'DISCHARGE_MONTH',
  REASON: 'REASON',
  DISCHARGE_TYPE: 'DISCHARGE_TYPE',
  INTENTION: 'INTENTION',
  COURT_MARTIAL: 'COURT_MARTIAL',
  PREV_APPLICATION: 'PREV_APPLICATION',
  PREV_APPLICATION_YEAR: 'PREV_APPLICATION_YEAR',
  PREV_APPLICATION_TYPE: 'PREV_APPLICATION_TYPE',
  FAILURE_TO_EXHAUST: 'FAILURE_TO_EXHAUST',
  PRIOR_SERVICE: 'PRIOR_SERVICE',
  REVIEW: 'REVIEW',
  RESULTS: 'RESULTS',
});

export const RESPONSES = Object.freeze({
  ARMY: 'Army',
  NAVY: 'Navy',
  AIR_FORCE: 'Air Force',
  COAST_GUARD: 'Coast Guard',
  MARINE_CORPS: 'Marine Corps',
  REASON_PTSD:
    'I suffered from undiagnosed, misdiagnosed, or untreated posttraumatic stress disorder (PTSD), or another mental health condition, during my service. I was discharged for reasons related to this condition.',
  REASON_TBI:
    'I suffered from an undiagnosed, misdiagnosed, or untreated traumatic brain injury (TBI) during my service. I was discharged for reasons related to this condition.',
  REASON_SEXUAL_ORIENTATION:
    'I was discharged due to my sexual orientation (including under the Don’t Ask, Don’t Tell policy).',
  REASON_SEXUAL_ASSAULT:
    'I experienced sexual assault or harassment during my service. I was discharged for reasons related to this experience.',
  REASON_TRANSGENDER:
    'I’m transgender, and my discharge shows my birth name instead of my current name.',
  REASON_DD215_UPDATE_TO_DD214:
    'I received a DD215 that shows my discharge upgrade or correction. But I want an updated DD214.',
  REASON_ERROR: 'My discharge paperwork has another kind of error.',
  REASON_UNJUST:
    'My discharge is unjust, and it isn’t related to any of the reasons listed here.',
  INTENTION_YES: `Yes, I want to change my name, discharge date, or something written in the "other remarks" section of my DD214. (This isn't common.)`,
  INTENTION_NO:
    'No, I want to change only my characterization of discharge, re-enlistment code, separation code, or narrative reason for discharge.',
  COURT_MARTIAL_YES:
    'Yes, my discharge was the outcome of a general court-martial.',
  COURT_MARTIAL_NO:
    'No, my discharge was administrative or the outcome of a special or summary court-martial.',
  NOT_SURE: `I'm not sure.`,
  DISCHARGE_HONORABLE:
    'My discharge is honorable or general under honorable conditions. I want to change only my narrative reason for discharge, separation code, or re-enlistment code.',
  DISCHARGE_DISHONORABLE: `My discharge isn't honorable or under honorable conditions.`,
  PREV_APPLICATION_DRB_DOCUMENTARY:
    'I applied to a Discharge Review Board (DRB) for a Documentary Review.',
  PREV_APPLICATION_DRB_PERSONAL:
    'I applied to a Discharge Review Board (DRB) for a Personal Appearance Review.',
  PREV_APPLICATION_BCMR:
    'I applied to a Board for Correction of Military Records (BCMR).',
  PREV_APPLICATION_BCNR:
    'I applied to the Board for Correction of Naval Records (BCNR).',
  YES: 'Yes',
  NO: 'No',
  PREV_APPLICATION_BEFORE_2014: '2014 or earlier',
  PREV_APPLICATION_AFTER_2014: 'After 2014',
  PREV_APPLICATION_BEFORE_2011: '2011 or earlier',
  PREV_APPLICATION_AFTER_2011: 'After 2011',
  PREV_APPLICATION_BEFORE_2017: '2017 or earlier',
  PREV_APPLICATION_AFTER_2017: 'After 2017',
  PRIOR_SERVICE_PAPERWORK_YES:
    'Yes, I have paperwork for a discharge that’s honorable or under honorable conditions.',
  PRIOR_SERVICE_PAPERWORK_NO:
    'Yes, I completed an earlier period of service. But I didn’t receive discharge paperwork from that period.',
  PRIOR_SERVICE_NO: 'No, I didn’t complete an earlier period of service.',
  FAILURE_TO_EXHAUST_BCMR_YES: `Yes, the BCMR denied my application due to "failure to exhaust other remedies."`,
  FAILURE_TO_EXHAUST_BCMR_NO: `No, the BCMR denied my application for other reasons, such as not agreeing with the evidence in my application.`,
  FAILURE_TO_EXHAUST_BCNR_YES: `Yes, the BCNR denied my application due to "failure to exhaust other remedies."`,
  FAILURE_TO_EXHAUST_BCNR_NO: `No, the BCNR denied my application for other reasons, such as not agreeing with the evidence in my application.`,
});

export const REVIEW_LABEL_MAP = Object.freeze({
  SERVICE_BRANCH: 'Branch of service:',
  DISCHARGE_YEAR: 'Year of discharge:',
  DISCHARGE_MONTH: 'Month of discharge:',
  REASON: 'Reason for changing discharge paperwork:',
  DISCHARGE_TYPE: 'Category that best describes you:',
  INTENTION: 'Information you want to change:',
  COURT_MARTIAL: 'Discharge was the outcome of a general court-martial:',
  PREV_APPLICATION: 'Previously denied a discharge upgrade:',
  PREV_APPLICATION_YEAR: 'Year applied for discharge upgrade:',
  PREV_APPLICATION_TYPE: 'Type of previous application:',
  FAILURE_TO_EXHAUST: 'Reason application denied:',
  PRIOR_SERVICE: 'Completed an earlier period of service:',
});
