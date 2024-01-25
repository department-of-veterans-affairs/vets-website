import _ from 'lodash';

export const selectGreetingName = state => {
  const result =
    state?.myHealth?.personalInformation?.data?.preferredName ||
    state?.user?.profile?.userFullName?.first ||
    null;

  if (!!result && result === result.toUpperCase()) {
    return _.capitalize(result);
  }

  return result;
};
