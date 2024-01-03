export const selectGreetingName = state =>
  state?.vaProfile?.personalInformation?.preferredName ||
  state?.user?.profile?.userFullName?.first ||
  state?.user?.profile?.email ||
  null;
