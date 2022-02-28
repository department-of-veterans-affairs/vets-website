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

export const CLEAR_EDIT_CONTEXT = 'CLEAR_EDIT_CONTEXT';

export const createClearEditContext = () => {
  return {
    type: CLEAR_EDIT_CONTEXT,
  };
};
