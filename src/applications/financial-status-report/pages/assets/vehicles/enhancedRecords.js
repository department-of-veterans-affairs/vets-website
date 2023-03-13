import EnhancedVehicleRecord from '../../../components/EnhancedVehicleRecord';

export const uiSchema = {
  enhancedVehicles: {
    'ui:widget': EnhancedVehicleRecord,
  },
};

export const schema = {
  type: 'object',
  properties: {
    enhancedVehicles: {
      type: 'boolean',
    },
  },
};
