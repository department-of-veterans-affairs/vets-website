export const selectAppointment = state => state.travelPay.appointment;

export const selectComplexClaim = state => state.travelPay.complexClaim.claim;

export const selectExpenseWithDocument = (state, expenseId) => {
  const expense = state.travelPay.complexClaim.expenses.data.find(
    exp => exp.id === expenseId,
  );

  if (!expense) return null;

  const document =
    expense.documentId &&
    state.travelPay.complexClaim.claim.data?.documents.find(
      doc => doc.documentId === expense.documentId,
    );

  return {
    ...expense,
    receipt: document || null,
  };
};

export const selectExpenseCreationLoadingState = state =>
  state.travelPay.complexClaim.expenses.creation?.isLoading || false;

export const selectExpenseUpdateLoadingState = state =>
  state.travelPay.complexClaim.expenses.update?.isLoading || false;

export const selectExpenseFetchLoadingState = state =>
  state.travelPay.complexClaim.expenses.fetch?.isLoading || false;

export const selectDocumentDeleteLoadingState = state =>
  state.travelPay.complexClaim.documentDelete?.isLoading || false;

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

export const selectComplexClaimFetchLoadingState = state =>
  state.travelPay.complexClaim.claim.fetch?.isLoading || false;

export const selectHasUnsavedExpenseChanges = state =>
  state.travelPay.complexClaim.expenses.hasUnsavedChanges || false;

export const selectReviewPageAlert = state => state.travelPay.reviewPageAlert;

export const selectExpenseBackDestination = state =>
  state.travelPay.complexClaim.expenseBackDestination;
