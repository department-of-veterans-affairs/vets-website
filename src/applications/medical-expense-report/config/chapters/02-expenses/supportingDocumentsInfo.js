import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { SupportingDocumentsDescription } from '../../../components/MedicalExpenseDescriptions';

/** @type {PageSchema} */
export default {
  title: 'Care expenses',
  path: 'expenses/care/supporting-documents',
  depends: formData => formData.hasCareExpenses === true,
  uiSchema: {
    ...titleUI('Submit supporting documents'),
    'ui:description': SupportingDocumentsDescription,
  },
  schema: {
    type: 'object',
    required: [],
    properties: {},
  },
};
