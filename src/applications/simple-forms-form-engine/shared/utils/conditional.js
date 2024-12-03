export const dependsOn = ({ operator, conditions }) => formData => {
  return conditions.reduce((acc, condition) => {
    const { field, value } = condition;
    const isConditionSatisfied = formData[field] === value;

    return operator === 'and'
      ? acc && isConditionSatisfied
      : acc || isConditionSatisfied;
  }, operator === 'and');
};
