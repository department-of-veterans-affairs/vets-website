export const QUESTION_MAP = Object.freeze({
  HOME: 'How to Apply for a Discharge Upgrade',
  SERVICE_BRANCH: 'What was your branch of service?',
  DISCHARGE_YEAR: 'What year were you discharged from the military?',
  DISCHARGE_MONTH: 'What month were you discharged?',
  REASON: 'Tell us why you want to change your discharge paperwork.',
  DISCHARGE_TYPE: `What's your character of discharge?`,
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
  REASON_1:
    'I suffered from undiagnosed, misdiagnosed, or untreated posttraumatic stress disorder (PTSD), or another mental health condition, during my service. I was discharged for reasons related to this condition.',
  REASON_2:
    'I suffered from an undiagnosed, misdiagnosed, or untreated traumatic brain injury (TBI) during my service. I was discharged for reasons related to this condition.',
  REASON_3:
    'I was discharged due to my sexual orientation (including under the Don’t Ask, Don’t Tell policy).',
  REASON_4:
    'I experienced sexual assault or harassment during my service. I was discharged for reasons related to this experience.',
  REASON_5:
    'I’m transgender, and my discharge shows my birth name instead of my current name.',
  REASON_8:
    'I received a DD215 that shows my discharge upgrade or correction. But I want an updated DD214.',
  REASON_6: 'My discharge paperwork has another kind of error.',
  REASON_7:
    'My discharge is unjust, and it isn’t related to any of the reasons listed here.',
  INTENTION_1: `Yes, I want to change my name, discharge date, or something written in the "other remarks" section of my DD214. (This isn't common.)`,
  INTENTION_2:
    'No, I want to change only my characterization of discharge, re-enlistment code, separation code, or narrative reason for discharge.',
  COURT_MARTIAL_1:
    'Yes, my discharge was the outcome of a general court-martial.',
  COURT_MARTIAL_2:
    'No, my discharge was administrative or the outcome of a special or summary court-martial.',
  COURT_MARTIAL_3: `I'm not sure.`,
  DISCHARGE_TYPE_1:
    'My discharge is honorable or general under honorable conditions. I want to change only my narrative reason for discharge, separation code, or re-enlistment code.',
  DISCHARGE_TYPE_2: `My discharge isn't honorable or under honorable conditions.`,
  PREV_APPLICATION_TYPE_1:
    'I applied to a Discharge Review Board (DRB) for a Documentary Review.',
  PREV_APPLICATION_TYPE_2:
    'I applied to a Discharge Review Board (DRB) for a Personal Appearance Review.',
  PREV_APPLICATION_TYPE_3A:
    'I applied to a Board for Correction of Military Records (BCMR).',
  PREV_APPLICATION_TYPE_3B:
    'I applied to the Board for Correction of Naval Records (BCNR).',
  PREV_APPLICATION_TYPE_4: "I'm not sure",
  PREV_APPLICATION_1: 'Yes',
  PREV_APPLICATION_2: 'No',
  PREV_APPLICATION_YEAR_1A: '2014 or earlier',
  PREV_APPLICATION_YEAR_2A: 'After 2014',
  PREV_APPLICATION_YEAR_1B: '2011 or earlier',
  PREV_APPLICATION_YEAR_2B: 'After 2011',
  PREV_APPLICATION_YEAR_1C: '2017 or earlier',
  PREV_APPLICATION_YEAR_2C: 'After 2017',
  PRIOR_SERVICE_1:
    'Yes, I have paperwork for a discharge that’s honorable or under honorable conditions.',
  PRIOR_SERVICE_2:
    'Yes, I completed an earlier period of service. But I didn’t receive discharge paperwork from that period.',
  PRIOR_SERVICE_3: 'No, I didn’t complete an earlier period of service.',
  FAILURE_TO_EXHAUST_1A: `Yes, the BCMR denied my application due to "failure to exhaust other remedies."`,
  FAILURE_TO_EXHAUST_2A: `No, the BCMR denied my application for other reasons, such as not agreeing with the evidence in my application.`,
  FAILURE_TO_EXHAUST_1B: `Yes, the BCNR denied my application due to "failure to exhaust other remedies."`,
  FAILURE_TO_EXHAUST_2B: `No, the BCNR denied my application for other reasons, such as not agreeing with the evidence in my application.`,
});

export const REVIEW_LABEL_MAP = Object.freeze({
  SERVICE_BRANCH: 'Branch of service:',
  DISCHARGE_YEAR: 'Year of discharge:',
  DISCHARGE_MONTH: 'Month of discharge',
  REASON: 'Reason for changing discharge paperwork:',
  DISCHARGE_TYPE: 'Character of discharge:',
  INTENTION:
    'Name change, discharge date, or something written in the "other remarks" section of your DD214:',
  COURT_MARTIAL: 'Discharge was the outcome of a general court-martial:',
  PREV_APPLICATION:
    'Previously applied for and been denied a discharge upgrade for this period of service:',
  PREV_APPLICATION_YEAR: 'Year applied for discharge upgrade:',
  PREV_APPLICATION_TYPE: 'Previous discharge upgrade:',
  FAILURE_TO_EXHAUST:
    'Application denial based on "failure to exhaust other remedies":',
  PRIOR_SERVICE:
    'Completed a period of service in which your character of service was honorable or general under honroable conditions:',
});
