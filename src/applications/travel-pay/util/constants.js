/**
 * "Denied", "On hold", and "In manual review" are listed first due to
 * users desiring to act on those the most. Other can be in alphabetical
 * order after that.
 */
export const CLAIMS_STATUSES = {
  DENIED: 'Denied',
  ON_HOLD: 'On hold',
  IN_MANUAL_REVIEW: 'In manual review',
  APPEAL: 'Appeal',
  APPROVED_FOR_PAYMENT: 'Approved for payment',
  APPROVED_FOR_PAYMENT_INCOMPLETE: 'Approved for payment incomplete',
  CLAIM_PAID: 'Claim paid',
  CLAIM_SUBMITTED: 'Claim submitted',
  CLOSED_WITH_NO_PAYMENT: 'Closed with no payment',
  FISCAL_RESCINDED: 'Fiscal rescinded',
  INCOMPLETE: 'Incomplete',
  IN_PROCESS: 'In process',
  PARTIAL_PAYMENT: 'Partial payment',
  PAYMENT_CANCELED: 'Payment canceled',
  PENDING: 'Pending',
  PRE_APPROVED_FOR_PAYMENT: 'Pre approved for payment',
  SAVED: 'Saved',
  SUBMITTED_FOR_PAYMENT: 'Submitted for payment',
  UNSPECIFIED: 'Unspecified',
};
