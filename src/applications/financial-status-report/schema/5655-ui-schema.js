import VeteranInfoBox from '../components/VeteranInfoBox';
import AvailableDebts from '../components/AvailableDebts';
// import EmploymentHistory from '../components/EmploymentHistory';

// import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';

export default {
  veteranInfoUI: {
    'ui:field': VeteranInfoBox,
  },
  availableDebtsUI: {
    'ui:field': AvailableDebts,
  },
  householdIncomeUI: {
    employmentHistory: {
      'ui:title': 'Your employment history',
      'view:hasBeenEmployed': {
        'ui:title': 'Have you been employed within the past two years?',
        'ui:widget': 'yesNo',
        'ui:required': () => true,
      },
      'view:isEmployed': {
        'ui:options': {
          expandUnder: 'view:hasBeenEmployed',
        },
        'view:currentlyEmployed': {
          'ui:title': 'Are you currently employed?',
          'ui:widget': 'yesNo',
          'ui:required': () => true,
        },
        'view:isCurrentlyEmployed': {
          'ui:options': {
            expandUnder: 'view:currentlyEmployed',
          },
          employmentType: {
            'ui:title': 'Type of employment',
          },
          employmentStart: {
            'ui:title': 'Employment start date',
          },
          employerName: {
            'ui:title': 'Employer name',
          },
        },
      },
      // 'ui:field': EmploymentHistory,
    },
  },
};
