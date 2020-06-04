import DebtLettersList from './components/DebtLettersList';
import DebtDetails from './components/DebtDetails';

export default [
  {
    component: DebtLettersList,
    name: 'View Debt Letters',
    path: '/debt-letters/view-letters',
  },
  {
    component: DebtDetails,
    name: 'View Debt Details',
    path: '/debt-letters/DebtDetails',
  },
];
