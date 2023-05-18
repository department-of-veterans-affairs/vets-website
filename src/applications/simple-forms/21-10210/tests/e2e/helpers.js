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
    signerFullName = data.witnessFullName;
  }

  if (signerFullName?.middle !== '' && signerFullName?.middle !== undefined) {
    return `${signerFullName.first} ${signerFullName.middle} ${
      signerFullName.last
    }`;
  }

  return `${signerFullName.first} ${signerFullName.last}`;
};
