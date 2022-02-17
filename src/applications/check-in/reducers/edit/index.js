const editPageInitialize = (state, action) => {
  return {
    ...state,
    edit: {
      ...state.edit,
      ...action.payload,
    },
  };
};

export { editPageInitialize };
