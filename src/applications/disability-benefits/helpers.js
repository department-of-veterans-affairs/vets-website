export const hasGuardOrReservePeriod = (formData) => {
  const serviceHistory = formData.servicePeriods;
  if (!serviceHistory || !Array.isArray(serviceHistory)) {
    return false;
  }

  return serviceHistory.reduce((isGuardReserve, { serviceBranch }) => {
    // For a new service period, service branch defaults to undefined
    if (!serviceBranch) {
      return false;
    }
    const { nationalGuard, reserve } = RESERVE_GUARD_TYPES;
    return isGuardReserve
        || serviceBranch.includes(reserve)
        || serviceBranch.includes(nationalGuard);
  }, false);
};

