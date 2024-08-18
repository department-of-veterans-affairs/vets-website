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
    const employmentStatusKeys = Object.keys(formData.employmentStatus).filter(
      key => formData.employmentStatus[key],
    );

    return employmentStatusKeys.some(status =>
      descriptionRequired.includes(status),
    );
  },
  uiSchema: {
    describeEmployment: textareaUI('Describe your employment situation'),
  },
  schema: {
    type: 'object',
    properties: {
      describeEmployment: textareaSchema,
    },
    required: ['describeEmployment'],
  },
};
