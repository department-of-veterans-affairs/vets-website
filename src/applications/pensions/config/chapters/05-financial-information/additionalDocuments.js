import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { showIncomeAndAssetsClarification } from '../../../helpers';
import { SupportingDocumentsNotice } from './helpers';

export const requiresAdditionalDocumentation = formData =>
  formData.totalNetWorth;

export default {
  title: 'Other payment options',
  path: 'financial/additional-documents',
  initialData: {},
  depends: formData =>
    showIncomeAndAssetsClarification() &&
    requiresAdditionalDocumentation(formData),
  uiSchema: {
    ...titleUI('Submit supporting documents', SupportingDocumentsNotice),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
