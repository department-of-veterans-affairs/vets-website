const NAMESPACE = 'financial.status.report';

const sessionStorageKeys = {
  JOB_EDITING_INDEX: `${NAMESPACE}.job.editing.index`,
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

export { getJobIndex, setJobIndex, clearJobIndex };
