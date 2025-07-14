import {
  textareaSchema,
  textareaUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { descriptionRequired } from '../../constants/options';

/** @type {PageSchema} */
export default {
  title: 'Employment status description',
  path: 'employment-status-description',
  depends: formData => {
    return descriptionRequired.includes(formData.employmentStatus);
  },
  uiSchema: {
    describeEmployment: textareaUI('Describe your employment situation.'),
  },
  schema: {
    type: 'object',
    properties: {
      describeEmployment: textareaSchema,
    },
    required: ['describeEmployment'],
  },
};
