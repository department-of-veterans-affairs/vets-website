export const EDITING_FIELD = 'EDITING_FIELD';

export const createEditFieldAction = ({
  originatingPage,
  key,
  value,
  title,
}) => {
  return {
    type: EDITING_FIELD,
    payload: {
      originatingPage,
      key,
      value,
      title,
    },
  };
};
