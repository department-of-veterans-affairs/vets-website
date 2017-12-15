const options = require('../common/utils/options-for-select.js');

export const labels = {
  drb: 'Discharge Review Board',
  bcmr: 'Board for Correction of Military Records (BCMR)',
  bcnr: 'Board for Correction of Naval Records (BCNR)',
};

export const venueWarning = 'You indicated you were not sure which venue you used to make your last application. This guidance is designed for Veterans who have not previously made any discharge upgrade applications; your process may differ based on your previous application. For more reliable guidance, please review your records and determine where you made your previous application.';
/* eslint-disable quote-props */
export const questionLabels = {
  '4_reason': {
    '1': 'I suffered from an undiagnosed, misdiagnosed, or untreated mental health condition including posttraumatic stress disorder (PTSD) in the service, and was discharged for reasons related to this condition.',
    '2': 'I suffered from an undiagnosed, misdiagnosed, or untreated Traumatic Brain Injury (TBI) in the service, and was discharged for reasons related to this condition.',
    '3': 'I was discharged due to my sexual orientation (including under the Don’t Ask Don’t Tell (DADT) policy).',
    '4': 'I was the victim of sexual assault or harassment in the service, and was discharged for reasons related to this incident.',
    '5': 'I am transgender, and my discharge shows my birth name instead of my current name.',
    '6': 'There is an error on my discharge paperwork for other reasons.',
    '7': 'My discharge is unjust or unfair punishment not related to any of the reasons listed above.',
    '8': 'I received a discharge upgrade or correction, but my upgrade came in the form of a DD-215 and I want an updated DD-214.',
  },
  '5_dischargeType': {
    '1': 'My discharge is Honorable or General Under Honorable Conditions, and I only want my narrative reason for discharge or enlistment code changed.',
    '2': 'My discharge status is not under honorable conditions.',
  },
  '6_intention': {
    '1': 'I want to change my name, discharge date, or anything written in the "other remarks" section of my DD-214 (this isn\'t common).',
    '2': 'I only want to change my discharge status, re-enlistment code, and/or narrative reason for discharge.',
  },
  '2_dischargeYear': {},
  '3_dischargeMonth': {},
  '7_courtMartial': {
    '1': 'My discharge was the outcome of a General Court Martial',
    '2': 'My discharge was administrative or the outcome of a Special or Summary Court Martial',
    '3': 'I\'m not sure if my discharge was the outcome of a General Court Martial',
  },
  '1_branchOfService': {
    army: 'Army',
    navy: 'Navy',
    airForce: 'Air Force',
    coastGuard: 'Coast Guard',
    marines: 'Marines',
  },
  '8_prevApplication': {
    '1': 'I have previously applied for a discharge upgrade for this period of service',
    '2': 'I have not previously applied for a discharge upgrade for this period of service',
  },
  '9_prevApplicationYear': {
    '1': 'or earlier',
    '2': 'after'
  },
  '10_prevApplicationType': {
    '1': 'I applied to a Discharge Review Board (DRB) for a Documentary Review',
    '2': 'I applied to a Discharge Review Board (DRB) for a Personal Appearance Review',
    '3': 'I applied to a Board for Correction of Military/Naval Records (BCMR/BCNR)',
    '4': 'I\'m not sure what kind of discharge upgrade application I previously made.',
  },
  '11_failureToExhaust': {
    '1': 'The BCMR/BCNR denied my application due to "failure to exhaust" other remedies (that is, for applying to the wrong Board).',
    '2': 'The BCMR/BCNR denied my application for other reasons, such as not agreeing with the substance of my claim.',
  },
  '12_priorService': {
    '1': 'I have discharge paperwork documenting a discharge under honorable or general under honorable conditions.',
    '2': 'I completed a prior period of service, but I did not receive discharge paperwork from that period.',
    '3': 'I did not complete an earlier period of service.',
  }
};
/* eslint-enable quote-props */

export const prevApplicationYearCutoff = {
  1: 2014,
  2: 2014,
  3: 2011,
  4: 2017,
};

export const answerReview = (key, formValues) => {
  const ans = formValues[key];
  const dischargeYearLabel = prevApplicationYearCutoff[formValues['4_reason']];
  const monthObj = options.months.find(m => String(m.value) === formValues['3_dischargeMonth']);
  const dischargeMonth = monthObj && monthObj.label;

  switch (key) {
    case '4_reason':
      return questionLabels[key][ans];
    case '5_dischargeType':
      return questionLabels[key][ans];
    case '6_intention':
      return questionLabels[key][ans];
    case '2_dischargeYear':
      if (ans === '1991' && !formValues['3_dischargeMonth']) {
        return 'I was discharged before 1991';
      }
      return `I was discharged in ${dischargeMonth || ''} ${formValues[key]}`;
    case '7_courtMartial':
      return questionLabels[key][ans];
    case '1_branchOfService':
      return `I served in the ${questionLabels[key][ans]}`;
    case '8_prevApplication':
      return questionLabels[key][ans];
    case '9_prevApplicationYear':
      return `I made my previous application ${ans === '1' ? `${dischargeYearLabel} or earlier` : `after ${dischargeYearLabel}`}`;
    case '10_prevApplicationType':
      if (ans === '3') {
        if (['navy', 'marines'].includes(formValues['1_branchOfService'])) {
          return 'I applied to the Board for Correction of Naval Records (BCNR)';
        }
        return 'I applied to a Board for Correction of Military Records (BCMR)';
      }
      return questionLabels[key][ans];
    default:
      return questionLabels[key][ans];
  }
};
