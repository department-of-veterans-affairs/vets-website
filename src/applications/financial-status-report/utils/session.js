const NAMESPACE = 'financial.status.report';

const sessionStorageKeys = {
  JOB_EDITING_INDEX: `${NAMESPACE}.job.editing.index`,
  JOB_BUTTON: `${NAMESPACE}.job.button`,
};

const jobButtonConstants = {
  FIRST_JOB: 'FIRST',
  ADD_ANOTHER: 'ADD',
  EDIT_JOB: 'EDIT',
};

const getJobIndex = () => {
  return sessionStorage.getItem(sessionStorageKeys.JOB_EDITING_INDEX);
};

const setJobIndex = index => {
  sessionStorage.setItem(sessionStorageKeys.JOB_EDITING_INDEX, index);
};

const clearJobIndex = () => {
  sessionStorage.removeItem(sessionStorageKeys.JOB_EDITING_INDEX);
};

// Job button values: First job, adding another, updating a job
const setJobButton = value => {
  sessionStorage.setItem(sessionStorageKeys.JOB_BUTTON, value);
};

const getJobButton = () => {
  return sessionStorage.getItem(sessionStorageKeys.JOB_BUTTON);
};

const clearJobButton = () => {
  sessionStorage.removeItem(sessionStorageKeys.JOB_BUTTON);
};

export {
  getJobIndex,
  setJobIndex,
  clearJobIndex,
  setJobButton,
  getJobButton,
  clearJobButton,
  jobButtonConstants,
};
