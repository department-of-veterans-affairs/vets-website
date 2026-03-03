const STATUS_KEYS = Object.freeze({
  INCOMPLETE: 'Incomplete',
  SAVED: 'Saved',
  IN_PROCESS: 'In process',
  CLAIM_SUBMITTED: 'Submitted',
  IN_MANUAL_REVIEW: 'In manual review',
  ON_HOLD: 'On hold',
  APPEALED: 'Appealed',
  PARTIAL_PAYMENT: 'Partial payment',
  DENIED: 'Denied',
  CLOSED_WITH_NO_PAYMENT: 'Closed with no payment',
  APPROVED_FOR_PAYMENT: 'Approved for payment',
  SUBMITTED_FOR_PAYMENT: 'Submitted for payment',
  FISCAL_RESCINDED: 'Fiscal rescinded',
  CLAIM_PAID: 'Paid',
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

const EXPENSE_TYPE_BY_API_ROUTE = Object.freeze({
  mileage: 'Mileage',
  parking: 'Parking',
  toll: 'Toll',
  commoncarrier: 'CommonCarrier',
  airtravel: 'AirTravel',
  lodging: 'Lodging',
  meal: 'Meal',
  other: 'Other',
});

module.exports = {
  STATUS_KEYS,
  EXPENSE_TYPE_OPTIONS,
  EXPENSE_TYPES,
  EXPENSE_TYPE_BY_API_ROUTE,
};
