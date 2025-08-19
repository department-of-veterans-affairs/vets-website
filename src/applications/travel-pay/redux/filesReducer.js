// filesReducer.js

// Action Types
export const ADD_FILE = 'ADD_FILE';
export const REMOVE_FILE = 'REMOVE_FILE';
export const UPDATE_EXPENSE_TYPE = 'UPDATE_EXPENSE_TYPE';
export const UPDATE_DATE = 'UPDATE_DATE';
export const UPDATE_AMOUNT = 'UPDATE_AMOUNT';
export const UPDATE_VENDOR_TYPE = 'UPDATE_VENDOR_TYPE';

// Initial State
// Have to set this otherwise the file field dont display since component doesnt re-render
const initialState = {
  files: [
    {
      file: {},
      name: null,
      date: '',
      amount: null,
      vendorType: '',
      expenseType: '',
    },
  ],
};

// Reducer
export default function filesReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_FILE:
      return {
        ...state,
        files: state.files.map(
          (file, i) =>
            i === action.index
              ? {
                  ...file,
                  ...action.payload, // merge existing with new data
                }
              : { file, ...action.payload },
        ),
      };

    case REMOVE_FILE:
      return {
        ...state,
        files: state.files.filter((_, i) => i !== action.index),
      };

    case UPDATE_EXPENSE_TYPE:
      return {
        ...state,
        files: state.files.map(
          (file, i) =>
            i === action.index
              ? { ...file, expenseType: action.payload }
              : file,
        ),
      };

    case UPDATE_DATE:
      return {
        ...state,
        files: state.files.map(
          (file, i) =>
            i === action.index ? { ...file, date: action.payload } : file,
        ),
      };

    case UPDATE_AMOUNT:
      return {
        ...state,
        files: state.files.map(
          (file, i) =>
            i === action.index ? { ...file, amount: action.payload } : file,
        ),
      };

    case UPDATE_VENDOR_TYPE:
      return {
        ...state,
        files: state.files.map(
          (file, i) =>
            i === action.index ? { ...file, vendorType: action.payload } : file,
        ),
      };

    default:
      return state;
  }
}
