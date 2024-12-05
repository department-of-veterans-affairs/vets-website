export const selectSupplies = state =>
  state?.mdotInProgressForm?.formData?.supplies?.filter(
    s => !!s?.availableForReorder,
  ) || [];

export const selectUnavailableSupplies = state =>
  state?.mdotInProgressForm?.formData?.supplies?.filter(
    s => !s?.availableForReorder,
  ) || [];

export const canReorderOn = state =>
  selectUnavailableSupplies(state)
    ?.map(s => s?.nextAvailabilityDate)
    ?.sort()
    ?.at(0);
