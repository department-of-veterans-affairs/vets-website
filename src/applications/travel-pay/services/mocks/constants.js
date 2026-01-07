const STATUS_KEYS = Object.freeze({
  INCOMPLETE: 'Incomplete',
  SAVED: 'Saved',
  IN_PROCESS: 'InProcess',
  CLAIM_SUBMITTED: 'ClaimSubmitted',
  IN_MANUAL_REVIEW: 'InManualReview',
  ON_HOLD: 'OnHold',
  APPEALED: 'Appealed',
  PARTIAL_PAYMENT: 'PartialPayment',
  DENIED: 'Denied',
  CLOSED_WITH_NO_PAYMENT: 'ClosedWithNoPayment',
  APPROVED_FOR_PAYMENT: 'ApprovedForPayment',
  SUBMITTED_FOR_PAYMENT: 'SubmittedForPayment',
  FISCAL_RESCINDED: 'FiscalRescinded',
  CLAIM_PAID: 'ClaimPaid',
  PAYMENT_CANCELED: 'PaymentCanceled',
});

// Used in mocks when determining how many expenses and which ones we show
const EXPENSE_TYPE_OPTIONS = Object.freeze({
  ALL: 'ALL',
  NONE: 'NONE',
  MILEAGE_ONLY: 'MILEAGE_ONLY',
});

module.exports = {
  STATUS_KEYS,
  EXPENSE_TYPE_OPTIONS,
};
