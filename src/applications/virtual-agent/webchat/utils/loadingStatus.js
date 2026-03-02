export const LOADING = 'loading';
export const COMPLETE = 'complete';
export const ERROR = 'error';

export function combineLoadingStatus(statusA, statusB) {
  const statuses = [statusA, statusB];

  if (statuses.includes(ERROR)) {
    return ERROR;
  }

  if (statuses.includes(LOADING)) {
    return LOADING;
  }

  if (statuses.every(status => status === COMPLETE)) {
    return COMPLETE;
  }

  throw new Error(
    `Invalid loading status statusA: ${statusA} statusB: ${statusB}`,
  );
}
