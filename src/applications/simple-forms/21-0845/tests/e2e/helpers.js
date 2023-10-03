import { AUTHORIZER_TYPES } from '../../definitions/constants';

export const getFullNameString = fullName => {
  if (fullName?.middle !== '' && fullName?.middle !== undefined) {
    return `${fullName.first} ${fullName.middle} ${fullName.last}`;
  }

  return `${fullName.first} ${fullName.last}`;
};

export const getSignerFullName = data => {
  const { authorizerType } = data;
  let signerFullName = data.veteranFullName; // default Flow 1: vet authorizer

  if (authorizerType === AUTHORIZER_TYPES.NON_VETERAN) {
    signerFullName = data.authorizerFullName; // Flow 2: non-vet authorizer
  }

  return getFullNameString(signerFullName);
};
