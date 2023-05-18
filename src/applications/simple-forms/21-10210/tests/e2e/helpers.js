import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../../definitions/constants';

export const getSignerFullName = data => {
  const { claimOwnership, claimantType } = data;
  let signerFullName = data.veteranFullName;

  if (
    claimOwnership === CLAIM_OWNERSHIPS.SELF &&
    claimantType === CLAIMANT_TYPES.NON_VETERAN
  ) {
    signerFullName = data.claimantFullName;
  } else if (claimOwnership === CLAIM_OWNERSHIPS.THIRD_PARTY) {
    if (claimantType === CLAIMANT_TYPES.VETERAN) {
      signerFullName = data.claimantFullName;
    } else {
      signerFullName = data.witnessFullName;
    }
  }

  return signerFullName;
};
