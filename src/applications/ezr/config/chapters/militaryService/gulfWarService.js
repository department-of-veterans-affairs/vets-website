import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import GulfWarServiceDescription from '../../../components/FormDescriptions/GulfWarServiceDescription';
import content from '../../../locales/en/content.json';

const { gulfWarService } = ezrSchema.properties;

export default {
  uiSchema: {
    'ui:title': content['military-service-gulf-war-service-title'],
    gulfWarService: {
      'ui:title': content['military-service-gulf-war-service-description'],
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
