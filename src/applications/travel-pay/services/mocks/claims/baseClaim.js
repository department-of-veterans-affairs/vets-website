const { v4: uuidv4 } = require('uuid');
const { randomInt } = require('crypto');
const { expenseByType } = require('../expenses/expenseData');
const { STATUS_KEYS, EXPENSE_TYPE_OPTIONS } = require('../constants');
const { generateAppointmentDates } = require('../vaos/appointmentUtils');

/**
 * Mock Claim Factory
 *
 * Builds a realistic Travel Pay claim payload for local mocks and UI testing.
 * This factory is intentionally flexible so list views and detail views can
 * share consistent claim data while varying status, expenses, and appointment info.
 *
 * Key behaviors:
 * - Supports overriding `claimId` and `claimNumber` so list → detail navigation
 *   returns the same claim the user clicked.
 * - Dynamically includes expenses based on `expenseTypeOptions`
 *   (ALL or MILEAGE_ONLY).
 * - Automatically generates documents for non-mileage expenses.
 * - Applies status-specific behavior:
 *   - DENIED: adds rejection reasons and decision letter documents
 *   - PARTIAL_PAYMENT: reimburses half the requested amount
 *   - CLAIM_PAID: reimburses the full requested amount
 * - Generates appointment dates aligned to VAOS 30-minute increments.
 * - Uses `daysOffset` to deterministically space appointments in time
 *   (e.g. list views showing multiple claims on different days).
 * - Derives `createdOn` and `modifiedOn` relative to the appointment date
 *   unless explicitly overridden.
 * - Allows appointment fields to be overridden to align with VAOS appointment mocks.
 *
 * This is a mock helper only and does not attempt to perfectly mirror backend
 * persistence rules — it focuses on front-end behavior fidelity and predictability.
 *
 * @param {Object} options
 * @param {string} [options.claimId]
 *   Existing claim ID (used when fetching claim details)
 * @param {string} [options.claimNumber]
 *   Existing claim number to keep list/detail consistent
 * @param {string} [options.claimStatus=STATUS_KEYS.SAVED]
 *   One of STATUS_KEYS
 * @param {string} [options.expenseTypeOptions=EXPENSE_TYPE_OPTIONS.ALL]
 *   Determines which expense types are included in the claim
 *   (e.g. ALL, MILEAGE_ONLY)
 * @param {number} [options.daysOffset=1]
 *   Day offset applied when generating the appointment date.
 *   Negative values create past appointments; positive values create future ones.
 *   Used to space multiple mock claims across different days.
 * @param {Object} [options.appointmentOverride]
 *   Optional overrides to force appointment data to match VAOS mocks
 * @param {string} [options.appointmentOverride.id]
 * @param {string} [options.appointmentOverride.appointmentDateTime]
 * @param {string} [options.appointmentOverride.facilityId]
 * @param {string} [options.appointmentOverride.facilityName]
 *
 * @returns {Object} Mock Travel Pay claim response
 */

function buildClaim({
  claimId: providedClaimId,
  claimNumber: providedClaimNumber,
  claimStatus = STATUS_KEYS.SAVED,
  expenseTypeOptions = EXPENSE_TYPE_OPTIONS.ALL,
  daysOffset = 1,
  appointmentOverride = {},
} = {}) {
  const claimId = providedClaimId ?? uuidv4();
  const claimNumber =
    providedClaimNumber ??
    `TC${randomInt(1_000_000_000_000, 10_000_000_000_000)}`;
  const isMileageExpense = exp => exp.expenseType?.toLowerCase() === 'mileage';

  // Decide which expenses to include
  let selectedExpenses = [];
  if (expenseTypeOptions === EXPENSE_TYPE_OPTIONS.ALL) {
    selectedExpenses = Object.values(expenseByType).map(exp => ({
      ...exp,
      ...(isMileageExpense(exp) ? {} : { documentId: uuidv4() }),
    }));
  } else if (expenseTypeOptions === EXPENSE_TYPE_OPTIONS.MILEAGE_ONLY) {
    const exp = expenseByType.mileage;
    selectedExpenses = [
      {
        ...exp,
        documentId: uuidv4(),
      },
    ];
  }

  // Create documents for each expense (except mileage)
  let documents = selectedExpenses.filter(exp => exp.documentId).map(exp => ({
    documentId: exp.documentId,
    filename: `${exp.expenseType}.txt`,
    mimetype: 'text/plain',
    createdOn: new Date().toISOString(),
    expenseId: exp.id,
  }));

  // Denied-specific adjustments
  let rejectionReason = null;
  let decisionLetterReason = null;

  if (claimStatus === STATUS_KEYS.DENIED) {
    // Replace default documents with denial documents
    documents = [
      {
        documentId: 'b2c3d4e5-2222-4c3b-8f20-bbbbbbbbbbbb',
        filename: 'Rejection Letter.docx',
        mimetype:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        createdon: new Date().toISOString(),
      },
      {
        documentId: 'c3d4e5f6-3333-4d4c-9a30-cccccccccccc',
        filename: 'VA Form 10-0998 Your Rights to Appeal Our Decision.pdf',
        mimetype: 'application/pdf',
        createdon: new Date().toISOString(),
      },
      ...documents, // keep expense-related docs
    ];

    rejectionReason = {
      rejectionReasonId: '12345',
      rejectionReasonName: 'Because',
      rejectionReasonTitle: 'Just because',
      rejectionReasonDescription: 'Because I said so',
    };

    decisionLetterReason =
      'You are a Service Connected Veteran with a rating of less than 30%, with income above the established low-income threshold or not on file to determine if a low-income status exists, and your medical appointment was not coded as treating your service connected condition(s).  Authority 38 CFR 70.10 (a)(2),(5) The appointment(s) associated with your date of travel does not qualify for payment.  For payment, an appointment must be in relation to care or services that you are eligible for, must be authorized in advance for a non-VA care appointment; and it must be completed unless due to actions other than yourself. Authority 38 CFR 70.4 (1)-(2)';
  }

  // PartialPayment and ClaimPaid-specific adjustments to reimbursementAmount
  let reimbursementAmount = 0.0;
  if (claimStatus === STATUS_KEYS.PARTIAL_PAYMENT) {
    reimbursementAmount =
      selectedExpenses.reduce((sum, e) => sum + e.costRequested, 0) / 2;
  } else if (claimStatus === STATUS_KEYS.CLAIM_PAID) {
    reimbursementAmount = selectedExpenses.reduce(
      (sum, e) => sum + e.costRequested,
      0,
    );
  }

  // Generate the appointmentDateTime aligned with VAOS 30-min increments
  // If overridden, the provided value is trusted as the source of truth.
  const appointmentDateTime =
    appointmentOverride.appointmentDateTime ??
    generateAppointmentDates(daysOffset).appointmentDateTime;

  // Helper to shift an ISO timestamp by N days.
  // Used to keep createdOn / modifiedOn consistent relative to appointment time.
  const addDays = (isoString, days) =>
    new Date(
      new Date(isoString).getTime() + days * 24 * 60 * 60 * 1000,
    ).toISOString();

  // Default lifecycle dates are derived from the appointment date:
  // - createdOn: 1 day before
  // - modifiedOn: 1 day after
  // These may be overridden to match list or detail mocks exactly.
  const createdOn =
    appointmentOverride.createdOn ?? addDays(appointmentDateTime, -1);
  const modifiedOn =
    appointmentOverride.modifiedOn ?? addDays(appointmentDateTime, 1);

  // Build the claim
  return {
    claimId,
    claimNumber,
    claimName: `Claim created for John Doe`,
    claimantFirstName: 'John',
    claimantMiddleName: 'Q',
    claimantLastName: 'Doe',
    claimSource: 'VaGov',
    claimStatus,
    appointmentDate: appointmentDateTime,
    facilityName:
      appointmentOverride.facilityName || 'Cheyenne VA Medical Center',
    totalCostRequested: selectedExpenses.reduce(
      (sum, e) => sum + e.costRequested,
      0,
    ),
    reimbursementAmount,
    createdOn,
    modifiedOn,
    appointment: {
      id: appointmentOverride.id,
      appointmentSource: 'API',
      appointmentDateTime,
      appointmentType: 'EnvironmentalHealth',
      facilityId: appointmentOverride.facilityId || '983GC',
      facilityName:
        appointmentOverride.facilityName || 'Cheyenne VA Medical Center',
      serviceConnectedDisability: 30,
      appointmentStatus: 'Complete',
      externalAppointmentId: `${randomInt(10000, 100000)}`,
      associatedClaimId: claimId,
      associatedClaimNumber: claimNumber,
      isCompleted: true,
    },
    rejectionReason,
    decisionLetterReason,
    expenses: selectedExpenses,
    documents,
  };
}

module.exports = {
  buildClaim,
};
