const { v4: uuidv4 } = require('uuid');
const { expenseByType } = require('./expenseData');

const expensesStore = {};

// Pre-fill store with static expense objects
for (const [, expense] of Object.entries(expenseByType)) {
  expensesStore[expense.id] = { ...expense };
}

let claimRef;

function setClaimRef(claim) {
  claimRef = claim;
}

function getExpenseHandler() {
  return (req, res) => {
    const { expenseId } = req.params;

    if (!expenseId || !expensesStore[expenseId]) {
      return res
        .status(404)
        .json({ errors: [{ detail: 'Expense not found test' }] });
    }

    return res.json(expensesStore[expenseId]);
  };
}

function createExpenseHandler(type) {
  return (req, res) => {
    const preset = expenseByType[type];

    if (!preset) {
      return res.status(500).json({
        errors: [{ detail: `Unknown expense type: ${type}` }],
      });
    }

    const newExpense = {
      ...preset,
      id: uuidv4(),
      documentId: uuidv4(),
      dateIncurred: new Date().toISOString(),
      ...(req.body || {}), // allow form values to override preset defaults
      costRequested: parseFloat(
        req.body?.costRequested ?? preset.costRequested ?? 0,
      ),
    };

    // Persist expense
    expensesStore[newExpense.id] = newExpense;

    // Sync to claim (review page source of truth)
    claimRef.expenses.push(newExpense);

    // Recalculate claim totals
    claimRef.totalCostRequested = claimRef.expenses.reduce(
      (sum, e) => sum + parseFloat(e.costRequested || 0),
      0,
    );

    return res.json({ id: newExpense.id });
  };
}

function updateExpenseHandler() {
  return (req, res) => {
    const { expenseId } = req.params;
    const updateData = req.body;

    const existing = expensesStore[expenseId];
    if (!existing) {
      return res.status(404).json({
        errors: [{ detail: 'Expense not found' }],
      });
    }

    // Map purchaseDate -> dateIncurred for consistency
    const normalizedUpdate = {
      ...updateData,
      ...(updateData.purchaseDate && {
        dateIncurred: updateData.purchaseDate,
      }),
    };

    // Ensure numeric fields are stored as numbers
    const updatedExpense = {
      ...existing,
      ...normalizedUpdate,
      costRequested:
        normalizedUpdate.costRequested !== undefined
          ? parseFloat(normalizedUpdate.costRequested)
          : existing.costRequested,
      reimbursementAmount:
        normalizedUpdate.reimbursementAmount !== undefined
          ? parseFloat(normalizedUpdate.reimbursementAmount)
          : existing.reimbursementAmount,
    };

    // Update the store
    expensesStore[expenseId] = updatedExpense;

    // Sync with claim
    const idx = claimRef.expenses.findIndex(e => e.id === expenseId);
    if (idx !== -1) {
      claimRef.expenses[idx] = {
        ...claimRef.expenses[idx],
        ...updatedExpense,
      };
    }

    // Recalculate claim totals
    claimRef.totalCostRequested = claimRef.expenses.reduce(
      (sum, e) => sum + parseFloat(e.costRequested || 0),
      0,
    );

    return res.json(updatedExpense);
  };
}

function deleteExpenseHandler() {
  return (req, res) => {
    const { expenseId } = req.params;

    const existing = expensesStore[expenseId];
    if (!existing) {
      return res.status(404).json({
        errors: [{ detail: 'Expense not found' }],
      });
    }

    // Remove from expense store
    delete expensesStore[expenseId];

    // Remove from claim expenses (review page source)
    claimRef.expenses = claimRef.expenses.filter(
      expense => expense.id !== expenseId,
    );

    // Recalculate claim totals
    claimRef.totalCostRequested = claimRef.expenses.reduce(
      (sum, e) => sum + parseFloat(e.costRequested || 0),
      0,
    );

    return res.status(204).send();
  };
}

module.exports = {
  getExpenseHandler,
  createExpenseHandler,
  setClaimRef,
  updateExpenseHandler,
  deleteExpenseHandler,
};
