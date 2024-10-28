import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import GulfWarServiceDescription from '../../../components/FormDescriptions/GulfWarServiceDescription';

const { gulfWarService } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Service after August 2, 1990',
    gulfWarService: {
      'ui:title': GulfWarServiceDescription,
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
