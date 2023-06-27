export const claimantIdentificationKeys = [
  'VETERAN',
  'SPOUSE',
  'PARENT',
  'CHILD',
];

export const claimantIdentificationOptions = {
  [claimantIdentificationKeys[0]]: 'Veteran',
  [claimantIdentificationKeys[1]]: 'Spouse of a Veteran',
  [claimantIdentificationKeys[2]]: 'Parent of a Veteran',
  [claimantIdentificationKeys[3]]: 'Child of a Veteran',
};

export const claimantIdentificationDisplayOptions = {
  [claimantIdentificationKeys[0]]: 'Veteran',
  [claimantIdentificationKeys[1]]: 'Veteran’s spouse',
  [claimantIdentificationKeys[2]]: 'Veteran’s parent',
  [claimantIdentificationKeys[3]]: 'Veteran’s child',
};

export const preparerQualificationsOptions = {
  COURT_APPOINTED_REP: 'Court-appointed representative',
  ATTORNEY: 'Attorney in fact or agent',
  CAREGIVER: 'Caregiver',
  MANAGER: 'Manager or Principal Officer',
};

export const preparerSigningReasonOptions = {
  UNDER18: 'They’re under 18 years old.',
  MENTALLY_INCAPABLE:
    'They don’t have the mental capacity to provide all the information needed for the form or to certify that the statements on the form are true and complete.',
  PHYSICALLY_INCAPABLE: 'They can’t physically sign the forms.',
};
