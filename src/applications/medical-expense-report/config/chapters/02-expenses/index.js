import selectExpenseTypes from './selectExpenseTypes';
import reportingPeriod from './reportingPeriod';
import careExpenses from './careExpenses';
import medicalExpenses from './medicalExpenses';
import mileage from './mileage';

export default {
  title: 'Expenses',
  pages: {
    selectExpenseTypes,
    reportingPeriod,
    careExpenses,
    medicalExpenses,
    mileage,
  },
};
