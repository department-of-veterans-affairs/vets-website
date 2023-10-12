const SERVER_ERROR_REGEX = /^5\d{2}$/;

export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);

export const totalDisabilityError = state => {
  return state.totalRating?.error ?? null;
};

export const hasTotalDisabilityServerError = state => {
  const error = totalDisabilityError(state);
  if (!error) {
    return false;
  }
  return isServerError(error.code);
};
