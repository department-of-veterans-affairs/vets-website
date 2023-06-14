export const CLAIM_OWNERSHIPS = {
  SELF: 'self',
  THIRD_PARTY: 'third-party',
};

export const CLAIMANT_TYPES = {
  VETERAN: 'veteran',
  NON_VETERAN: 'non-veteran',
};

export const SERVED_WITH_VETERAN = 'Served with Veteran';
export const FAMILY_OR_FRIEND_OF_VETERAN = 'Family/Friend of Veteran';
export const COWORKER_OR_SUPERVISOR_OF_VETERAN =
  'Coworker/Supervisor of Veteran';
export const SERVED_WITH_CLAIMANT = 'Served with Claimant';
export const FAMILY_OR_FRIEND_OF_CLAIMANT = 'Family/Friend of Claimant';
export const COWORKER_OR_SUPERVISOR_OF_CLAIMANT =
  'Coworker/Supervisor of Claimant';
export const OTHER_RELATIONSHIP = 'A relationship not listed here';

export const RELATIONSHIP_TO_VETERAN_OPTIONS = [
  SERVED_WITH_VETERAN,
  FAMILY_OR_FRIEND_OF_VETERAN,
  COWORKER_OR_SUPERVISOR_OF_VETERAN,
  OTHER_RELATIONSHIP,
];

export const RELATIONSHIP_TO_CLAIMANT_OPTIONS = [
  SERVED_WITH_CLAIMANT,
  FAMILY_OR_FRIEND_OF_CLAIMANT,
  COWORKER_OR_SUPERVISOR_OF_CLAIMANT,
  OTHER_RELATIONSHIP,
];

export const workInProgressContent = {
  description:
    'We’re rolling out the Lay/Witness Statement (VA Form 21-10210) in stages. It’s not quite ready yet. Please check back again soon.',
  redirectLink: '/',
  redirectText: 'Return to VA home page',
};
