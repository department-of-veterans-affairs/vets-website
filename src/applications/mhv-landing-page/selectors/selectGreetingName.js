export const selectGreetingName = state =>
  state?.myHealth?.personalInformation?.data?.preferredName ||
  state?.user?.profile?.userFullName?.first ||
  state?.user?.profile?.email ||
  null;
