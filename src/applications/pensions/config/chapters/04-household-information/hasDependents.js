import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { showDependentsMultiplePage } from '../../../helpers';

/** @type {PageSchema} */
export default {
  title: 'Dependents',
  path: 'household/dependents',
  depends: () => !showDependentsMultiplePage(),
  uiSchema: {
    ...titleUI('Dependent children'),
    'view:hasDependents': yesNoUI({
      title: 'Do you have any dependent children?',
    }),
  },
  schema: {
    type: 'object',
    required: ['view:hasDependents'],
    properties: {
      'view:hasDependents': yesNoSchema,
    },
  },
};
