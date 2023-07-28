export const CLAIMANT_TYPES = Object.freeze({
  VETERAN: 'veteran',
  SPOUSEORCHILD: 'spouseOrChild',
  OTHER: 'other',
});

export const CLAIMANT_TYPES_LABELS = Object.freeze({
  [CLAIMANT_TYPES.VETERAN]: 'I am a Veteran',
  [CLAIMANT_TYPES.SPOUSEORCHILD]: 'I am a spouse or child of a Veteran',
  [CLAIMANT_TYPES.OTHER]: 'I am someone not listed here',
});
