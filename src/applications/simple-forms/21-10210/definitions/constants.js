export const CLAIM_OWNERSHIPS = {
  SELF: 'self',
  THIRD_PARTY: 'third-party',
};

export const CLAIMANT_TYPES = {
  VETERAN: 'veteran',
  NON_VETERAN: 'non-veteran',
};

export const SERVED_WITH_VETERAN = 'I served with the Veteran';
export const FAMILY_OR_FRIEND_OF_VETERAN =
  'I’m the Veteran’s family member or friend';
export const COWORKER_OR_SUPERVISOR_OF_VETERAN =
  'I’m the Veteran’s coworker or supervisor';
export const SERVED_WITH_CLAIMANT = 'I served with the claimant';
export const FAMILY_OR_FRIEND_OF_CLAIMANT =
  'I’m the claimant’s family or friend';
export const COWORKER_OR_SUPERVISOR_OF_CLAIMANT =
  'I’m the claimant’s coworker or supervisor';
export const OTHER_RELATIONSHIP = 'We have a relationship not listed here';

export const RELATIONSHIP_TO_VETERAN_OPTIONS = Object.fromEntries(
  [
    SERVED_WITH_VETERAN,
    FAMILY_OR_FRIEND_OF_VETERAN,
    COWORKER_OR_SUPERVISOR_OF_VETERAN,
    OTHER_RELATIONSHIP,
  ].map(option => [option, option]),
);

export const RELATIONSHIP_TO_CLAIMANT_OPTIONS = Object.fromEntries(
  [
    SERVED_WITH_CLAIMANT,
    FAMILY_OR_FRIEND_OF_CLAIMANT,
    COWORKER_OR_SUPERVISOR_OF_CLAIMANT,
    OTHER_RELATIONSHIP,
  ].map(option => [option, option]),
);
