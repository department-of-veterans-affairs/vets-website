import VehicleSummaryWidget from './VehicleSummaryWidget';

export const uiSchema = {
  'ui:title': 'Vehicles summary',
  vehicleSummary: {
    'ui:title': ' ',
    'ui:field': 'StringField', // this is necessary, but shows type errors
    'ui:widget': VehicleSummaryWidget,
  },
};

export const schema = {
  type: 'object',
  properties: {
    vehicleSummary: {
      type: 'array',
      items: {
        type: 'object',
        properties: {}, // we won't render any form elements here
      },
    },
  },
};
