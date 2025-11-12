export const selectAppointment = state => state.travelPay.appointment;

export const selectComplexClaim = state => state.travelPay.complexClaim.claim;

export const selectExpense = (state, expenseId) =>
  state.travelPay.complexClaim.expenses.data[expenseId];

export const selectExpenseCreationLoadingState = state =>
  state.travelPay.complexClaim.expenses.creation?.isLoading || false;

export const selectExpenseUpdateLoadingState = state =>
  state.travelPay.complexClaim.expenses.update?.isLoading || false;

export const selectIsExpenseDeleting = (state, expenseId) => {
  const isDeleteLoading =
    state.travelPay.complexClaim.expenses.delete?.isLoading || false;
  const deleteExpenseId =
    state.travelPay.complexClaim.expenses.delete?.id || '';
  return isDeleteLoading && deleteExpenseId === expenseId;
};

export const selectAllExpenses = state =>
  state.travelPay.complexClaim.expenses.data || [];

export const selectAllDocuments = state => {
  return state.travelPay.complexClaim.claim.data?.documents || [];
};

export const selectComplexClaimCreationLoadingState = state =>
  state.travelPay.complexClaim.claim.creation.isLoading;

export const selectCreatedComplexClaim = state =>
  state.travelPay.complexClaim.claim.creation.data;

export const selectComplexClaimSubmissionState = state =>
  state.travelPay.complexClaim.claim.submission;
