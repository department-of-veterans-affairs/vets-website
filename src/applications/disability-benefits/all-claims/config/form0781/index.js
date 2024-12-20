import workflowChoicePage from '../../pages/form0781/workflowChoicePage';
import * as manualUploadPage from '../../pages/form0781/manualUploadPage';
import * as mentalHealthSupportInfoPage from '../../pages/form0781/mentalHealthSupportInfoPage';
import {
  showForm0781Pages,
  showManualUpload0781Page,
  showMentalHealthSupportInfoPage,
} from '../../utils/form0781';

/**
 * Configuration for our modern 0781 paper sync (2024/2025)
 *
 * @returns Object
 */
export const form0781PagesConfig = {
  workflowChoicePage: {
    path: 'additional-forms/mental-health-statement',
    depends: formData => showForm0781Pages(formData),
    uiSchema: workflowChoicePage.uiSchema,
    schema: workflowChoicePage.schema,
  },
  manualUploadPage: {
    path:
      'disability/file-disability-claim-form-21-526ez/additional-forms/mental-health-statement/upload',
    uiSchema: manualUploadPage.uiSchema,
    depends: formData => showManualUpload0781Page(formData),
    schema: manualUploadPage.schema,
  },
  mentalHealthSupportInfoPage: {
    path:
      'disability/file-disability-claim-form-21-526ez/additional-forms/mental-health-statement/support',
    uiSchema: mentalHealthSupportInfoPage.uiSchema,
    depends: formData => showMentalHealthSupportInfoPage(formData),
    schema: mentalHealthSupportInfoPage.schema,
  },
};
