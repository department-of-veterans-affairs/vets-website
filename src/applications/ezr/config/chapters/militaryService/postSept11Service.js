import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import PostSept11ServiceDescription from '../../../components/FormDescriptions/PostSept11ServiceDescription';

const { gulfWarService } = ezrSchema.properties;

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
