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
    '3': 'I was discharged due to sexual orientation under Don’t Ask Don’t Tell (DADT) or preceding policies.',
    '4': 'I was the victim of sexual assault or harassment in the service, and was discharged for reasons related to this incident.',
    '5': 'I am transgender, and my discharge shows my birth name instead of my current name.',
    '6': 'There is an error on my discharge paperwork for other reasons.',
    '7': 'My discharge is unjust or unfair punishment for other reasons.',
  },
  '5_dischargeType': {
    '1': 'My discharge is Honorable or General Under Honorable Conditions, and I only want my narrative reason for discharge or enlistment code changed.',
    '2': 'My discharge status is not under honorable conditions.',
  },
  '6_intention': {
    '1': 'I want to change other information on my record, like my name or remarks.',
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
    '4': 'I\'m not sure what type of application I made when I was previously denied an upgrade',
  },
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
  const dischargeMonth = options.months[formValues['3_dischargeMonth']] && options.months[formValues['3_dischargeMonth']].label;


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
      if (ans !== '4') {
        return questionLabels[key][ans];
      }
      return 'I am not sure what type of application I made.';
    default:
      return null;
  }
};
