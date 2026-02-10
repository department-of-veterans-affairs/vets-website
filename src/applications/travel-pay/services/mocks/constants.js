const STATUS_KEYS = Object.freeze({
  INCOMPLETE: 'Incomplete',
  SAVED: 'Saved',
  IN_PROCESS: 'In process',
  CLAIM_SUBMITTED: 'Claim submitted',
  IN_MANUAL_REVIEW: 'In manual review',
  ON_HOLD: 'On hold',
  APPEALED: 'Appealed',
  PARTIAL_PAYMENT: 'Partial payment',
  DENIED: 'Denied',
  CLOSED_WITH_NO_PAYMENT: 'Closed with no payment',
  APPROVED_FOR_PAYMENT: 'Approved for payment',
  SUBMITTED_FOR_PAYMENT: 'Submitted for payment',
  FISCAL_RESCINDED: 'Fiscal rescinded',
  CLAIM_PAID: 'Claim paid',
  PAYMENT_CANCELED: 'Payment canceled',
});

// Used in mocks when determining how many expenses and which ones we show
const EXPENSE_TYPE_OPTIONS = Object.freeze({
  ALL: 'ALL',
  NONE: 'NONE',
  MILEAGE_ONLY: 'MILEAGE_ONLY',
});

const EXPENSE_TYPES = [
  'mileage',
  'parking',
  'toll',
  'commoncarrier',
  'airtravel',
  'lodging',
  'meal',
  'other',
];

module.exports = {
  STATUS_KEYS,
  EXPENSE_TYPE_OPTIONS,
  EXPENSE_TYPES,
};
