const setSessionHandler = (state, action) => {
  return {
    ...state,
    context: {
      ...state.context,
      token: action.payload.token,
      permissions: action.payload.permissions,
    },
  };
};

export { setSessionHandler };
