import PostSept11ServiceDescription from '../../../components/FormDescriptions/PostSept11ServiceDescription';
import { FULL_SCHEMA } from '../../../utils/imports';

const { gulfWarService } = FULL_SCHEMA.properties;

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
