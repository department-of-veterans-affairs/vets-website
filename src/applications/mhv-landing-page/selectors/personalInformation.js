export const selectGreetingName = state => {
  return (
    state?.user?.profile?.preferredName ||
    state?.user?.profile?.userFullName?.first ||
    null
  );
};
