export const LOADING = 'loading';
export const COMPLETE = 'complete';
export const ERROR = 'error';

export function combineLoadingStatus(statusA, statusB) {
  if (statusA === ERROR || statusB === ERROR) return ERROR;
  if (statusA === LOADING || statusB === LOADING) return LOADING;
  if (statusA === COMPLETE && statusB === COMPLETE) return COMPLETE;
  throw new Error(
    `Invalid loading status statusA: ${statusA} statusB: ${statusB}`,
  );
}
