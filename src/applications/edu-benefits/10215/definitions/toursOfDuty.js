import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import ServicePeriodView from 'platform/forms/components/ServicePeriodView';

export default {
  'ui:title': 'Service periods',
  'ui:options': {
    itemName: 'Service Period',
    viewField: ServicePeriodView,
    hideTitle: true,
  },
  items: {
    dateRange: dateRangeUI(
      'Service start date',
      'Service end date',
      'End of service must be after start of service',
    ),
    serviceBranch: {
      'ui:title': 'Branch of service',
    },
    serviceStatus: {
      'ui:title':
        'Type of service (Active duty, drilling reservist, IRR, etc.)',
    },
    applyPeriodToSelected: {
      'ui:title': 'Apply this service period to the benefit I’m applying for.',
      'ui:options': {
        hideOnReviewIfFalse: true,
      },
    },
    benefitsToApplyTo: {
      'ui:title': 'Please explain how you’d like this service period applied.',
      'ui:widget': 'textarea',
      'ui:options': {
        expandUnder: 'applyPeriodToSelected',
        expandUnderCondition: false,
      },
    },
  },
};
