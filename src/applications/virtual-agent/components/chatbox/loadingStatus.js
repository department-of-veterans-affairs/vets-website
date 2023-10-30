export const LOADING = 'loading';
export const COMPLETE = 'complete';
export const ERROR = 'error';

export function combineLoadingStatus(statusA, statusB, statusC) {
  if (statusA === ERROR || statusB === ERROR || statusC === ERROR) {
    return ERROR;
  }
  if (statusA === LOADING || statusB === LOADING || statusC === LOADING) {
    return LOADING;
  }
  if (statusA === COMPLETE && statusB === COMPLETE && statusC === COMPLETE) {
    return COMPLETE;
  }
  throw new Error(
    `Invalid loading status statusA: ${statusA} statusB: ${statusB} statusC: ${statusC}`,
  );
}
