export const selectAppointment = state => state.travelPay.appointment;

export const selectClaimDetails = (state, id) => ({
  ...state.travelPay.claimDetails,
  data: state.travelPay.claimDetails.data[id],
});

export const selectExpense = (state, claimId, expenseId) =>
  state.travelPay.claimDetails[claimId].expenses.find(e => e.id === expenseId);

export const selectExpenseLoadingState = state =>
  state.travelPay.expense.isLoading;
