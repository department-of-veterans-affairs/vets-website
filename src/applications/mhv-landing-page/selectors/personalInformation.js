import _ from 'lodash';

export const selectGreetingName = state => {
  const result =
    state?.user?.profile?.preferredName ||
    state?.user?.profile?.userFullName?.first ||
    null;

  if (!!result && result === result.toUpperCase()) {
    return _.capitalize(result);
  }

  return result;
};

export const selectPersonalInformation = state =>
  state?.myHealth?.personalInformation || {};
