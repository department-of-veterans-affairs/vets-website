// @ts-check
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import PostSept11ServiceDescription from '../../../components/FormDescriptions/PostSept11ServiceDescription';
import content from '../../../locales/en/content.json';

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
      gulfWarService: yesNoSchema,
    },
  },
};
