module.exports = {
  labels: {
    drb: 'Discharge Review Board',
    bcmr: 'Board for Correction of Military Records (BCMR)',
    bcnr: 'Board for Correction of Naval Records (BCNR)',
  },
  /* eslint-disable quote-props */
  questionLabels: {
    '1_reason': {
      '1': 'I suffered from an undiagnosed, misdiagnosed, or untreated mental health condition including posttraumatic stress disorder (PTSD) in the service, and was discharged for reasons related to this condition.',
      '2': 'I suffered from an undiagnosed, misdiagnosed, or untreated Traumatic Brain Injury (TBI) in the service, and was discharged for reasons related to this condition.',
      '3': 'I was discharged due to homosexual conduct under Don’t Ask Don’t Tell (DADT) or preceding policies.',
      '4': 'I was the victim of sexual assault or harassment in the service, and was discharged for reasons related to this incident.',
      '5': 'I am transgender, and my discharge shows my birth name instead of my current name.',
      '6': 'There is an error on my discharge paperwork for other reasons.',
      '7': 'My discharge is unjust or unfair punishment for other reasons.',
    },
    '1_dischargeType': {},
    '1_intention': {},
    '2_dischargeYear': {},
    '2_dischargeMonth': {},
    '3_courtMartial': {},
    '4_branchOfService': {
      army: 'Army',
      navy: 'Navy',
      airForce: 'Air Force',
      coastGuard: 'Coast Guard',
      marines: 'Marines',
    },
    '5_prevApplication': {
      '1': 'I have previously applied for a discharge upgrade for this period of service.',
      '2': 'I have not previously applied for a discharge upgrade for this period of service.',
    },
    '5_prevApplicationYear': {},
    '5_prevApplicationType': {},
  }
  /* eslint-enable quote-props */
};
