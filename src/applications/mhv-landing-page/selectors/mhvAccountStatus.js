const userActionErrorCodes = ['801', '805', '806', '807'];

export const mhvAccountStatusLoading = state => {
  return state?.myHealth?.accountStatus?.loading;
};

export const mhvAccountStatusUsersuccess = state => {
  return (
    !state?.myHealth?.accountStatus?.loading &&
    !state?.myHealth?.accountStatus?.data?.errors
  );
};

export const mhvAccountStatusUserError = state => {
  if (state?.myHealth?.accountStatus?.data?.errors) {
    return state?.myHealth?.accountStatus?.data?.errors.filter(error =>
      userActionErrorCodes.includes(error.code),
    );
  }
  return [];
};

export const mhvAccountStatusNonUserError = state => {
  if (state?.myHealth?.accountStatus?.data?.errors) {
    return state?.myHealth?.accountStatus?.data?.errors.filter(
      error => !userActionErrorCodes.includes(error.code),
    );
  }
  return [];
};
