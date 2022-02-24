export const EDITING_FIELD = 'EDITING_FIELD';

export const createEditFieldAction = data => {
  return {
    type: EDITING_FIELD,
    payload: {
      ...data,
    },
  };
};
