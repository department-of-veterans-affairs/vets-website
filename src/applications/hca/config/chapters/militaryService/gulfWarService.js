// @ts-check
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import GulfWarServiceDescription from '../../../components/FormDescriptions/GulfWarServiceDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['service-info--gulf-war-service-title']),
    gulfWarService: yesNoUI({
      title: GulfWarServiceDescription,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      gulfWarService: yesNoSchema,
    },
  },
};
