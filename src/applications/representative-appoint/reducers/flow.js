const INITIAL_STATE = {
  subTitle: 'VA Form 21-22',
  repType: 'Veterans Service Officer',
  authenticated: false,
};

export const FlowReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 1:
    case 2:
    case 3:
      return {};
    default:
      return state;
  }
};
