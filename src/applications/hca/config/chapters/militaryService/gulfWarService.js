// @ts-check
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import GulfWarServiceDescription from '../../../components/FormDescriptions/GulfWarServiceDescription';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { gulfWarService } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['service-info--gulf-war-service-title']),
    gulfWarService: yesNoUI({
      title: content['service-info--gulf-war-service-label'],
      description: GulfWarServiceDescription,
      headerAriaDescribedby:
        content['service-info--gulf-war-service-aria-label'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      gulfWarService,
    },
  },
};
