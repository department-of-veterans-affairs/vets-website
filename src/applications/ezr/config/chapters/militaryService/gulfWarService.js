import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import GulfWarServiceDescription from '../../../components/FormDescriptions/GulfWarServiceDescription';

const { gulfWarService } = ezrSchema.properties;

export default {
  uiSchema: {
    'ui:title': 'Service in Gulf War locations',
    gulfWarService: {
      'ui:title': 'Did you serve in any of these Gulf War locations?',
      'ui:description': GulfWarServiceDescription,
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      gulfWarService,
    },
  },
};
