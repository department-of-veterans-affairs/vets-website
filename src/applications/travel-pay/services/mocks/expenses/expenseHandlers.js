import { expenseByType } from './expenseData';

export function getExpenseHandler(type) {
  return (req, res) => {
    const expense = expenseByType[type];

    if (!expense) {
      return res.status(500).json({
        errors: [{ detail: `Unknown expense type: ${type}` }],
      });
    }

    if (req.params.expenseId === expense.id) {
      return res.json(expense);
    }

    return res.status(404).json({
      errors: [{ detail: 'Expense not found' }],
    });
  };
}

export function createExpenseHandler(type) {
  return (req, res) => {
    const expense = expenseByType[type];

    if (!expense) {
      return res.status(500).json({
        errors: [{ detail: `Unknown expense type: ${type}` }],
      });
    }

    return res.json({ id: expense.id });
  };
}
