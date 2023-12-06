export const claimantIdentificationKeys = [
  'VETERAN',
  'SPOUSE',
  'PARENT',
  'CHILD',
];

export const claimantIdentificationOptions = Object.freeze({
  [claimantIdentificationKeys[0]]: 'I’m signing for a Veteran.',
  [claimantIdentificationKeys[1]]: 'I’m signing for a spouse of a Veteran.',
  [claimantIdentificationKeys[2]]: 'I’m signing for a parent of a Veteran.',
  [claimantIdentificationKeys[3]]: 'I’m signing for a child of a Veteran.',
});

export const claimantIdentificationDisplayOptions = Object.freeze({
  [claimantIdentificationKeys[0]]: 'Veteran',
  [claimantIdentificationKeys[1]]: 'Veteran’s spouse',
  [claimantIdentificationKeys[2]]: 'Veteran’s parent',
  [claimantIdentificationKeys[3]]: 'Veteran’s child',
});

export const preparerQualificationsOptions = Object.freeze({
  COURT_APPOINTED_REP: 'Court-appointed representative',
  ATTORNEY: 'Attorney in fact or agent',
  CAREGIVER: 'Caregiver',
  MANAGER: 'Manager or Principal Officer',
});

export const preparerSigningReasonOptions = Object.freeze({
  UNDER18: 'They’re under 18 years old.',
  MENTALLY_INCAPABLE:
    'They have an illness, injury, or other health condition that prevents them from being able to make decisions for themselves or provide the information needed to complete forms.',
  PHYSICALLY_INCAPABLE: 'They can’t physically sign the forms.',
});

export const workInProgressContent = Object.freeze({
  description:
    'We’re rolling out Alternate Signer (VA Form 21-0972) in stages. It’s not quite ready yet. Please check back again soon.',
  redirectLink: '/',
  redirectText: 'Return to VA home page',
});
