const setAppHandler = (state, action) => {
  return { ...state, ...action.payload };
};

export { setAppHandler };
