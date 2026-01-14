export function transformCareExpenses(formData) {
  const parsedFormData = JSON.parse(formData);
  const transformedValue = parsedFormData;
  if (parsedFormData?.careExpenses?.length) {
    transformedValue.careExpenses = parsedFormData.careExpenses.map(expense => {
      const transformedExpense = { ...expense };
      if (expense?.hoursPerWeek) {
        transformedExpense.hoursPerWeek = Number(expense.hoursPerWeek);
      }
      return transformedExpense;
    });
  }
  return JSON.stringify(transformedValue);
}
