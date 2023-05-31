export const CLAIM_OWNERSHIPS = {
  SELF: 'self',
  THIRD_PARTY: 'third-party',
};

export const CLAIMANT_TYPES = {
  VETERAN: 'veteran',
  NON_VETERAN: 'non-veteran',
};

export const SERVED_WITH_CLAIMANT = 'Served with Veteran/Claimant';
export const FAMILY_OR_FRIEND_OF_CLAIMANT = 'Family/Friend of Veteran/Claimant';
export const COWORKER_OR_SUPERVISOR_OF_CLAIMANT =
  'Coworker/Supervisor of Veteran/Claimant';

export const RELATIONSHIP_TO_CLAIMANT_OPTIONS = [
  SERVED_WITH_CLAIMANT,
  FAMILY_OR_FRIEND_OF_CLAIMANT,
  COWORKER_OR_SUPERVISOR_OF_CLAIMANT,
];
