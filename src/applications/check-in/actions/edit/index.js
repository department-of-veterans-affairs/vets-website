export const SET_EDIT_CONTEXT = 'SET_EDIT_CONTEXT';

export const createSetEditContext = ({
  originatingUrl,
  editingPage,
  value,
  key,
}) => {
  return {
    type: SET_EDIT_CONTEXT,
    payload: {
      originatingUrl,
      editingPage,
      value,
      key,
    },
  };
};
