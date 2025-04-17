import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../../definitions/constants';

export const getSignerFullName = data => {
  const { claimOwnership, claimantType } = data;
  let signerFullName = data.veteranFullName; // default Flow 1: self claim, vet claimant

  if (claimOwnership === CLAIM_OWNERSHIPS.THIRD_PARTY) {
    signerFullName = data.witnessFullName; // Flows 2 & 4: third-party claim, non-vet claimant
  } else if (claimantType === CLAIMANT_TYPES.NON_VETERAN) {
    signerFullName = data.claimantFullName; // Flow 3: self claim, non-vet claimant
  }

  if (signerFullName?.middle !== '' && signerFullName?.middle !== undefined) {
    return `${signerFullName.first} ${signerFullName.middle} ${signerFullName.last}`;
  }

  return `${signerFullName.first} ${signerFullName.last}`;
};
