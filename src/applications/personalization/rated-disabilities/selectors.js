import { isClientError, isServerError } from './util';

const totalDisabilityError = state => {
  return state.totalRating?.error ?? null;
};

export const hasTotalDisabilityClientError = state => {
  const error = totalDisabilityError(state);
  if (!error) {
    return false;
  }
  return isClientError(error.code);
};

export const hasTotalDisabilityServerError = state => {
  const error = totalDisabilityError(state);
  if (!error) {
    return false;
  }
  return isServerError(error.code);
};
