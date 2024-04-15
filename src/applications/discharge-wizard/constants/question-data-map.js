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
  PREVIOUS_APPLICATION_TYPE: 'PREVIOUS_APPLICATION_TYPE',
  PREVIOUS_APPLICATION: 'PREVIOUS_APPLICATION',
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
});
