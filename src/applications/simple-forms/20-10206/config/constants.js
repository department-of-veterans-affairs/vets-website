export const PREPARER_TYPES = Object.freeze({
  VETERAN: 'veteran',
  DEPENDENT: 'dependent',
  REP_VETERAN: 'veteranRep',
  REP_DEPENDENT: 'dependentRep',
});
export const PREPARER_TYPE_LABELS = Object.freeze({
  [PREPARER_TYPES.VETERAN]: 'I’m a Veteran, and I intend to file a VA claim.',
  [PREPARER_TYPES.DEPENDENT]:
    'I’m the spouse or child of a Veteran, and I intend to file a VA claim.',
  [PREPARER_TYPES.REP_VETERAN]:
    'I’m an alternate signer, Veterans Service Officer, fiduciary, or third-party representative for a Veteran who intends to file a VA claim.',
  [PREPARER_TYPES.REP_DEPENDENT]:
    'I’m an alternate signer, Veterans Service Officer, fiduciary, or third-party representative for a Veteran’s spouse or child who intends to file a VA claim.',
});
