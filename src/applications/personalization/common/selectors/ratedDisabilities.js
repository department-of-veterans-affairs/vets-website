import { isClientError, isServerError } from '../helpers';

export const totalDisabilityError = state => {
  return state.totalRating?.error ?? null;
};

export const hasTotalDisabilityError = state => {
  const error = totalDisabilityError(state);
  if (!error) {
    return false;
  }
  return isServerError(error.status) || isClientError(error.status);
};
