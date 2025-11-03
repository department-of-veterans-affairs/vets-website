export const selectAppointment = state => state.travelPay.appointment;

export const selectComplexClaim = state => state.travelPay.complexClaim.claim;

export const selectComplexClaimData = state =>
  state.travelPay.complexClaim.claim.data;

export const selectExpense = (state, expenseId) =>
  state.travelPay.complexClaim.expenses.data[expenseId];

// Expense creation selectors (no ID needed)
export const selectExpenseCreationLoadingState = state =>
  state.travelPay.complexClaim.expenses.creation?.isLoading || false;

export const selectExpenseCreationError = state =>
  state.travelPay.complexClaim.expenses.creation?.error || null;

// Individual expense selectors for update operations
export const selectExpenseUpdateLoadingState = state =>
  state.travelPay.complexClaim.expenses.update?.isLoading || false;

export const selectExpenseUpdateError = state =>
  state.travelPay.complexClaim.expenses.update?.error || null;

export const selectExpenseUpdateId = state =>
  state.travelPay.complexClaim.expenses.update?.id || '';

// Individual expense selectors for delete operations
export const selectExpenseDeleteLoadingState = state =>
  state.travelPay.complexClaim.expenses.delete?.isLoading || false;

export const selectExpenseDeleteError = state =>
  state.travelPay.complexClaim.expenses.delete?.error || null;

export const selectExpenseDeleteId = state =>
  state.travelPay.complexClaim.expenses.delete?.id || '';

// Selector to check if a specific expense is being deleted
export const selectIsExpenseDeleting = (state, expenseId) => {
  const isDeleteLoading =
    state.travelPay.complexClaim.expenses.delete?.isLoading || false;
  const deleteExpenseId =
    state.travelPay.complexClaim.expenses.delete?.id || '';
  return isDeleteLoading && deleteExpenseId === expenseId;
};

export const selectExpenseData = (state, expenseId) =>
  state.travelPay.complexClaim.expenses.data.find(
    expense => expense.id === expenseId,
  ) || null;

export const selectAllExpenses = state =>
  state.travelPay.complexClaim.expenses.data || [];

export const selectComplexClaimCreationLoadingState = state =>
  state.travelPay.complexClaim.claim.creation.isLoading;

export const selectCreatedComplexClaim = state =>
  state.travelPay.complexClaim.claim.creation.data;
