const setEditingContext = (state, action) => {
  return {
    ...state,
    context: {
      ...state.context,
      editing: { ...action.payload },
    },
  };
};

const clearEditingContext = state => {
  const next = { ...state };
  delete next.context.editing;
  return next;
};

export { setEditingContext, clearEditingContext };
