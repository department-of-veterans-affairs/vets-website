const initialState = {
  // whatever initial state you have
  isInitialized: true, // bogus value to satisfy linting until we have real state
};

export default function askVa(state = initialState, action) {
  if (action && action.type === 'INITIALIZE') {
    return {
      ...state,
      isInitialized: true,
    };
  }

  return {
    ...state,
  };
}
