const userActionErrorCodes = [801, 805, 806, 807];

export const mhvAccountStatusLoading = state => {
  return state?.myHealth?.accountStatus?.loading;
};

// Prioritize user actionable errors (userActionErrorCodes)
// over other less actionable errors
export const mhvAccountStatusErrorsSorted = state => {
  if (state?.myHealth?.accountStatus?.data?.errors) {
    return state?.myHealth?.accountStatus?.data?.errors.sort(
      (a, b) =>
        userActionErrorCodes.includes(b.code) -
        userActionErrorCodes.includes(a.code),
    );
  }
  return [];
};

export const mhvAccountStatusUserError = state => {
  if (state?.myHealth?.accountStatus?.data?.errors) {
    return state?.myHealth?.accountStatus?.data?.errors.filter(error =>
      userActionErrorCodes.includes(error.code),
    );
  }
  return [];
};
