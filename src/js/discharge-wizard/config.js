module.exports = {
  labels: {
    drb: 'Discharge Review Board',
    bcmr: 'Board for Correction of Military Records (BCMR)',
    bcnr: 'Board for Correction of Naval Records (BCNR)',
  },
  venueWarning: 'You indicated you were not sure which venue you used to make your last application. This guidance is designed for Veterans who have not previously made any discharge upgrade applications; your process may differ based on your previous application. For more reliable guidance, please review your records and determine where you made your previous application.',
  /* eslint-disable quote-props */
  questionLabels: {
    '1_reason': {
      '1': 'I suffered from an undiagnosed, misdiagnosed, or untreated mental health condition including posttraumatic stress disorder (PTSD) in the service, and was discharged for reasons related to this condition.',
      '2': 'I suffered from an undiagnosed, misdiagnosed, or untreated Traumatic Brain Injury (TBI) in the service, and was discharged for reasons related to this condition.',
      '3': 'I was discharged due to sexual orientation under Don’t Ask Don’t Tell (DADT) or preceding policies.',
      '4': 'I was the victim of sexual assault or harassment in the service, and was discharged for reasons related to this incident.',
      '5': 'I am transgender, and my discharge shows my birth name instead of my current name.',
      '6': 'There is an error on my discharge paperwork for other reasons.',
      '7': 'My discharge is unjust or unfair punishment for other reasons.',
    },
    '2_dischargeType': {},
    '3_intention': {},
    '4_dischargeYear': {},
    '5_dischargeMonth': {},
    '6_courtMartial': {},
    '7_branchOfService': {
      army: 'Army',
      navy: 'Navy',
      airForce: 'Air Force',
      coastGuard: 'Coast Guard',
      marines: 'Marines',
    },
    '8_prevApplication': {
      '1': 'I have previously applied for a discharge upgrade for this period of service.',
      '2': 'I have not previously applied for a discharge upgrade for this period of service.',
    },
    '9_prevApplicationYear': {},
    '10_prevApplicationType': {},
  }
  /* eslint-enable quote-props */
};
