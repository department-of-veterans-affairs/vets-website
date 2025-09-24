import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import GulfWarServiceDescription from '../../../components/FormDescriptions/GulfWarServiceDescription';
import content from '../../../locales/en/content.json';

const { gulfWarService } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['service-info--gulf-war-service-title']),
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
