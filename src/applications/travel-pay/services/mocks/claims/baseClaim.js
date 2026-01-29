const { v4: uuidv4 } = require('uuid');
const { randomInt } = require('crypto');
const { expenseByType } = require('../expenses/expenseData');
const { STATUS_KEYS, EXPENSE_TYPE_OPTIONS } = require('../constants');

/**
 * Factory to build a claim
 *
 * @param {Object} options - Options to customize the claim
 * @param {string} options.claimStatus - One of STATUS_KEYS (default: STATUS_KEYS.SAVED)
 * @param {string} options.expenseTypeOptions - Which expenses to include (default: EXPENSE_TYPE_OPTIONS.ALL)
 * @returns {Object} - A mock claim object
 */
function buildClaim({
  claimStatus = STATUS_KEYS.SAVED,
  expenseTypeOptions = EXPENSE_TYPE_OPTIONS.ALL,
} = {}) {
  const claimId = uuidv4();
  const claimNumber = `TC${randomInt(1_000_000_000_000, 10_000_000_000_000)}`; // Mock claim number
  const isMileageExpense = exp => exp.expenseType?.toLowerCase() === 'mileage';

  // Decide which expenses to include
  let selectedExpenses = [];
  if (expenseTypeOptions === EXPENSE_TYPE_OPTIONS.ALL) {
    selectedExpenses = Object.values(expenseByType).map(exp => ({
      ...exp,
      ...(isMileageExpense(exp) ? {} : { documentId: uuidv4() }),
      costSubmitted: claimStatus === 'Saved' ? exp.costRequested : 0,
    }));
  } else if (expenseTypeOptions === EXPENSE_TYPE_OPTIONS.MILEAGE_ONLY) {
    const exp = expenseByType.mileage;
    selectedExpenses = [
      {
        ...exp,
        documentId: uuidv4(),
        costSubmitted: claimStatus === 'Saved' ? exp.costRequested : 0,
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

  const now = new Date();

  const appointmentDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      9,
      30,
      0,
    ),
  )
    .toISOString()
    .replace('.000Z', 'Z');
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
    appointmentDate,
    facilityName: 'Cheyenne VA Medical Center',
    totalCostRequested: selectedExpenses.reduce(
      (sum, e) => sum + e.costRequested,
      0,
    ),
    reimbursementAmount,
    createdOn: appointmentDate,
    modifiedOn: appointmentDate,
    appointment: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      appointmentSource: 'API',
      appointmentDateTime: appointmentDate,
      appointmentType: 'EnvironmentalHealth',
      facilityId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      facilityName: 'Cheyenne VA Medical Center',
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
