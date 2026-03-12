// @ts-check
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import PostSept11ServiceDescription from '../../../components/FormDescriptions/PostSept11ServiceDescription';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { gulfWarService } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['service-info--post911-title']),
    gulfWarService: yesNoUI({
      title: content['service-info--post911-label'],
      description: PostSept11ServiceDescription,
      headerAriaDescribedby: content['service-info--post911-aria-label'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      gulfWarService,
    },
  },
};
