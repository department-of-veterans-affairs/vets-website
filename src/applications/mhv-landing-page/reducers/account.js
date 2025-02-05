const initialState = {
  data: {},
  error: false,
  loading: false,
};

export const fetchAccountStatus = 'fetchAccountStatus';
export const fetchAccountStatusSuccess = 'fetchAccountStatusSuccess';
export const fetchAccountStatusFailed = 'fetchAccountStatusFailed';

const reducer = (state = initialState, action) => {
  const { errors, data, type } = action;
  switch (type) {
    case fetchAccountStatus:
      return { ...state, loading: true };
    case fetchAccountStatusSuccess:
      return { ...state, data, loading: false };
    case fetchAccountStatusFailed:
      return { ...state, data: {}, error: errors, loading: false };
    default:
      return state;
  }
};

export default reducer;
