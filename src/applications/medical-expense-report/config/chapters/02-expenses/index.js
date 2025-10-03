import reportingPeriod from './reportingPeriod';
import careExpenses from './careExpenses';
import careExpensesDetails from './careExpensesDetails';
import supportingDocumentsInfo from './supportingDocumentsInfo';
import medicalExpenses from './medicalExpenses';
import medicalExpensesDetails from './medicalExpensesDetails';
import milageExpenses from './milageExpenses';
import milageExpensesDetails from './milageExpensesDetails';

export default {
  title: 'Expenses',
  pages: {
    reportingPeriod,
    careExpenses,
    supportingDocumentsInfo,
    careExpensesDetails,
    medicalExpenses,
    medicalExpensesDetails,
    milageExpenses,
    milageExpensesDetails,
  },
};
