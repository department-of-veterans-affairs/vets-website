import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import GulfWarServiceDescription from '../../../components/FormDescriptions/GulfWarServiceDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    'ui:title': content['military-service-gulf-war-service-title'],
    gulfWarService: yesNoUI({
      title: content['military-service-gulf-war-service-description'],
      description: GulfWarServiceDescription,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      gulfWarService: yesNoSchema,
    },
  },
};
