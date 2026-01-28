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
      title: PostSept11ServiceDescription,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      gulfWarService: yesNoSchema,
    },
  },
};
