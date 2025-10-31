import {
  radioUI,
  radioSchema,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { dicOptions } from '../../../utils/labels';

const uiSchema = {
  ...arrayBuilderItemFirstPageTitleUI({ title: 'D.I.C. benefits' }),
  'view:dicType': radioUI({
    title:
      'What Dependency and indemnity compensation (D.I.C.) benefit are you claiming?',
    labels: dicOptions,
    classNames: 'vads-u-margin-bottom--2',
  }),
};

const schema = {
  type: 'object',
  properties: {
    'view:dicType': radioSchema(Object.keys(dicOptions)),
  },
  required: ['view:dicType'],
};

export default {
  uiSchema,
  schema,
};
