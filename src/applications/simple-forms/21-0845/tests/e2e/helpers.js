import { AUTHORIZER_TYPES } from '../../definitions/constants';

export const getSignerFullName = data => {
  const { authorizerType } = data;
  let signerFullName = data.veteranFullName; // default Flow 1: vet authorizer

  if (authorizerType === AUTHORIZER_TYPES.NON_VETERAN) {
    signerFullName = data.authorizerFullName; // Flow 2: non-vet authorizer
  }

  if (signerFullName?.middle !== '' && signerFullName?.middle !== undefined) {
    return `${signerFullName.first} ${signerFullName.middle} ${
      signerFullName.last
    }`;
  }

  return `${signerFullName.first} ${signerFullName.last}`;
};
