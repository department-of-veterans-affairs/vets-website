import { startCase, toLower } from 'lodash';

export const selectGreetingName = state => {
  return (
    state?.user?.profile?.preferredName ||
    startCase(toLower(state?.user?.profile?.userFullName?.first)) ||
    null
  );
};
