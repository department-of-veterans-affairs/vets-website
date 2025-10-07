import reportingPeriod from './reportingPeriod';
import careExpenses from './careExpenses';
import careExpensesAdd from './careExpensesAdd';
import supportingDocumentsInfo from './supportingDocumentsInfo';
import medicalExpenses from './medicalExpenses';
import medicalExpensesAdd from './medicalExpensesAdd';
import milageExpenses from './milageExpenses';
import milageExpensesAdd from './milageExpensesAdd';

export default {
  title: 'Expenses',
  pages: {
    reportingPeriod,
    careExpenses,
    supportingDocumentsInfo,
    careExpensesAdd,
    medicalExpenses,
    medicalExpensesAdd,
    milageExpenses,
    milageExpensesAdd,
  },
};
