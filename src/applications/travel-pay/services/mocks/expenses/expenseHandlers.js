const { v4: uuidv4 } = require('uuid');
const { expenseByType } = require('./expenseData');
const { expensesStore, claimsStore } = require('../mockStore');
const { EXPENSE_TYPE_BY_API_ROUTE } = require('../constants');

/**
 * Find the claim that contains a given expenseId
 *
 * @param {Object} claimsStore
 * @param {string} expenseId
 * @returns {Object|null} claim
 */
function findClaimByExpenseId(expenseId) {
  return (
    Object.values(claimsStore).find(
      claim =>
        Array.isArray(claim.expenses) &&
        claim.expenses.some(expense => expense.id === expenseId),
    ) || null
  );
}

function resolveClaimForCreate(claimId) {
  if (claimsStore[claimId]) {
    return claimsStore[claimId];
  }

  return Object.values(claimsStore).find(
    claim =>
      claim.id === claimId ||
      claim.claimId === claimId ||
      claim.appointment?.associatedClaimId === claimId,
  );
}

/**
 * Get an expense by ID
 */
function getExpenseHandler() {
  return (req, res) => {
    const { expenseId } = req.params;

    if (!expenseId || !expensesStore[expenseId]) {
      return res
        .status(404)
        .json({ errors: [{ detail: 'Expense not found' }] });
    }

    return res.json(expensesStore[expenseId]);
  };
}

/**
 * Create a new expense for a specific claim
 */
function createExpenseHandler(type) {
  return (req, res) => {
    const { claimId } = req.params;
    const expenseData = req.body;

    // Create new document for this expense (except mileage, which doesn't require a receipt)
    const documentId = type.toLowerCase() === 'mileage' ? null : uuidv4();
    const filename = documentId ? expenseData.receipt.fileName : null;
    const mimetype = documentId ? expenseData.receipt.contentType : null;

    // Remove receipt from expense data since it's now represented as a separate document
    delete expenseData.receipt;

    // Create dateIncurred from purchaseDate for consistency
    if (expenseData.purchaseDate) {
      expenseData.dateIncurred = expenseData.purchaseDate;
      delete expenseData.purchaseDate;
    }

    if (!claimsStore[claimId]) {
      throw new Error(`Claim ${claimId} not loaded`);
    }

    const claim = resolveClaimForCreate(claimId);

    if (!claim) {
      return res.status(404).json({ errors: [{ detail: 'Claim not found' }] });
    }
    const newExpense = {
      id: uuidv4(),
      expenseType: EXPENSE_TYPE_BY_API_ROUTE[type],
      name: `${expenseByType[type].name} Expense`,
      dateIncurred: expenseData.dateIncurred,
      description: expenseData.description,
      costRequested: expenseData.costRequested,
      costSubmitted: 0,
      ...expenseData, // Include any additional fields sent in the request
    };

    // Persist expense globally
    expensesStore[newExpense.id] = newExpense;

    // Attach to claim
    claim.expenses = claim.expenses || [];
    claim.expenses.push(newExpense);
    claim.documents.push({
      documentId,
      filename,
      mimetype,
      createdOn: new Date().toISOString(),
      expenseId: newExpense.id,
    });

    // Recalculate claim total cost
    claim.totalCostRequested = claim.expenses.reduce(
      (sum, e) => sum + parseFloat(e.costRequested || 0),
      0,
    );

    return res.json({ id: newExpense.id });
  };
}

/**
 * Update an existing expense
 */
function updateExpenseHandler() {
  return (req, res) => {
    const { expenseId } = req.params;
    const updateData = req.body;

    const expense = expensesStore[expenseId];
    if (!expense) {
      return res
        .status(404)
        .json({ errors: [{ detail: 'Expense not found' }] });
    }

    const claim = findClaimByExpenseId(expenseId);
    if (!claim) {
      return res.status(404).json({ errors: [{ detail: 'Claim not found' }] });
    }

    // Normalize fields
    if (updateData.purchaseDate) {
      updateData.dateIncurred = updateData.purchaseDate;
      delete updateData.purchaseDate;
    }

    if (updateData.costRequested !== undefined) {
      expense.costRequested = Number(updateData.costRequested);
    }

    // Mutate in place
    Object.assign(expense, updateData);

    // Force claim to reference the canonical expense object
    claim.expenses = claim.expenses.map(
      e => (e.id === expenseId ? expense : e),
    );

    // Recalculate totals
    claim.totalCostRequested = claim.expenses.reduce(
      (sum, e) => sum + Number(e.costRequested || 0),
      0,
    );

    return res.json(expense);
  };
}

/**
 * Delete an expense
 */
function deleteExpenseHandler() {
  return (req, res) => {
    const { expenseId } = req.params;

    const expense = expensesStore[expenseId];
    if (!expense) {
      return res
        .status(404)
        .json({ errors: [{ detail: 'Expense not found' }] });
    }

    const claimCopy = findClaimByExpenseId(expenseId);
    const claim = claimsStore[claimCopy.id];
    if (!claim) {
      return res
        .status(404)
        .json({ errors: [{ detail: 'Claim not found for this expense' }] });
    }

    // Remove from global store
    delete expensesStore[expenseId];

    // Remove expense from claim entirely
    claim.expenses = claim.expenses.filter(e => e.id !== expenseId);

    // Remove from claim documents as well
    claim.documents = claim.documents.filter(
      doc => doc.expenseId !== expenseId,
    );

    // Recalculate total cost
    claim.totalCostRequested = claim.expenses.reduce(
      (sum, e) => sum + Number(e.costRequested || 0),
      0,
    );

    return res.status(204).send();
  };
}

module.exports = {
  getExpenseHandler,
  createExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
};
