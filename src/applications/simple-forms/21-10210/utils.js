import {
  CLAIM_OWNERSHIPS,
  CLAIMANT_TYPES,
  OTHER_RELATIONSHIP,
} from './definitions/constants';

export function getFullNamePath(formData) {
  if (formData.claimOwnership === CLAIM_OWNERSHIPS.THIRD_PARTY) {
    return 'witnessFullName';
  }
  if (
    formData.claimOwnership === CLAIM_OWNERSHIPS.SELF &&
    formData.claimantType === CLAIMANT_TYPES.NON_VETERAN
  ) {
    return 'claimantFullName';
  }
  return 'veteranFullName';
}

export const witnessHasOtherRelationship = formData => {
  const { claimOwnership, witnessRelationshipToClaimant } = formData;

  if (!!claimOwnership && !!witnessRelationshipToClaimant) {
    return (
      claimOwnership === CLAIM_OWNERSHIPS.THIRD_PARTY &&
      witnessRelationshipToClaimant.includes(OTHER_RELATIONSHIP)
    );
  }

  return false;
};
