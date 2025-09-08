import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import PostSept11ServiceDescription from '../../../components/FormDescriptions/PostSept11ServiceDescription';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { gulfWarService } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['service-info--post911-title']),
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
