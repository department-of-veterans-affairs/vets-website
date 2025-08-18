export const initialState = {
  files: [
    // Example of an empty file slot to start with
    // You can start with an empty array if you prefer no placeholders
    // But here's the fully shaped object for reference:
    // {
    //   name: '',
    //   amount: null,
    //   expenseType: '',
    //   vendorType: '',
    // }
  ],
};

export function filesReducer(state, action) {
  switch (action.type) {
    case 'ADD_FILE':
      return {
        ...state,
        files: [
          ...state.files,
          {
            name: action.payload.name || '',
            amount: null,
            expenseType: '',
            vendorType: '',
            ...action.payload, // merge any extra data if provided
          },
        ],
      };

    case 'REMOVE_FILE':
      return {
        ...state,
        files: state.files.filter((_, idx) => idx !== action.index),
      };
    case 'UPDATE_EXPENSE_TYPE':
      return {
        ...state,
        files: state.files.map(
          (f, idx) =>
            idx === action.index ? { ...f, expenseType: action.payload } : f,
        ),
      };
    case 'UPDATE_VENDOR_TYPE':
      return {
        ...state,
        files: state.files.map(
          (f, idx) =>
            idx === action.index ? { ...f, vendorType: action.payload } : f,
        ),
      };
    case 'UPDATE_AMOUNT':
      return {
        ...state,
        files: state.files.map(
          (f, idx) =>
            idx === action.index ? { ...f, amount: action.payload } : f,
        ),
      };
    default:
      return state;
  }
}
