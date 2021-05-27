export const LOADING = 'loading';
export const COMPLETE = 'complete';
export const ERROR = 'error';

export function combineLoadingStatus(statusA, statusB) {
  if (statusA === ERROR || statusB === ERROR) {
    return ERROR;
  } else if (statusA === LOADING || statusB === LOADING) {
    return LOADING;
  } else if (statusA === COMPLETE && statusB === COMPLETE) {
    return COMPLETE;
  } else {
    throw new Error(
      `Invalid loading status statusA: ${statusA} statusB: ${statusB}`,
    );
  }
}
