// import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
// import HospitalizationPeriodView from '../components/HospitalizationPeriodView';
//
// import fullSchema from '../config/schema';

export const uiSchema = {
  hospitalizationHistory: {
    // items: {
    hospitalName: {
      // 'ui:options': {
      //   itemName: 'Provider',
      //   viewField: HospitalizationPeriodView,
      //   hideTitle: true,
      // },
      'ui:title': 'Name of hospital',
    },
    // },
  },
};

export const schema = {
  type: 'object',
  properties: {
    hospitalizationHistory: {
      // type: 'array',
      // items: {
      type: 'object',
      properties: {
        hospitalName: {
          type: 'string',
        },
      },
      // },
    },
  },
};
