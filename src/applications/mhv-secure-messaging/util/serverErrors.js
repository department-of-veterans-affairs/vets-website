export const edgeCaseBackendError = error => {
  return {
    title: 'Edge Case Backend Error',
    detail: 'Edge Case Backend Error',
    response: JSON.stringify(error),
  };
};

const isArray = randomInput => {
  return randomInput instanceof Array;
};

export const getFirstError = error => {
  const errors = error?.errors || [];
  if (isArray(errors) && errors.length > 0) {
    return errors[0];
  }
  return edgeCaseBackendError(error);
};
