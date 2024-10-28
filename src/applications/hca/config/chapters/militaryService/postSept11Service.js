import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PostSept11ServiceDescription from '../../../components/FormDescriptions/PostSept11ServiceDescription';

const { gulfWarService } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Service post-9/11',
    gulfWarService: {
      'ui:title': PostSept11ServiceDescription,
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
