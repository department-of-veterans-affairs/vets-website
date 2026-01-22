export const shouldSkipSync = ({
  loggedIn,
  togglesLoading,
  formData,
  flagValue,
  pathname,
  didInit,
  isIntroOrStart,
}) => {
  if (!loggedIn) return true;
  if (togglesLoading) return true;
  if (!formData) return true;
  if (typeof flagValue !== 'boolean') return true;
  if (didInit) return true;

  const safePathname = pathname || '';
  if (isIntroOrStart(safePathname)) return true;

  return false;
};

export const computeSynchronizedFormData = ({
  formData,
  newConditionsFlowEnabled,
  syncRatedDisabilitiesToNewConditions,
  syncNewConditionsToRatedDisabilities,
  normalizeNewDisabilities,
}) => {
  // Choose the direction based on the flag.
  let nextData = newConditionsFlowEnabled
    ? syncRatedDisabilitiesToNewConditions(formData)
    : syncNewConditionsToRatedDisabilities(formData);

  nextData = normalizeNewDisabilities(nextData);

  // Return null to indicate "no update needed"
  return nextData !== formData ? nextData : null;
};
