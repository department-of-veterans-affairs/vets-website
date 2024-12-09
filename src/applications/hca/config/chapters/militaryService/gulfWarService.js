import { FULL_SCHEMA } from '../../../utils/imports';
import GulfWarServiceDescription from '../../../components/FormDescriptions/GulfWarServiceDescription';

const { gulfWarService } = FULL_SCHEMA.properties;

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
