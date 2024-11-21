import * as workflowChoicePage from '../../pages/form0781/workflowChoicePage';
import { showForm0781Pages } from '../../utils/form0781';
import { additionalFormsTitle } from '../../content/form0781';

/**
 * Configuration for our modern 0781 paper sync (2024/2025)
 *
 * @returns Object
 */
export const form0781PagesConfig = {
  workflowChoicePage: {
    title: 'wipn 3',
    path: 'mental-health-statement',
    depends: formData => showForm0781Pages(formData),
    uiSchema: workflowChoicePage.uiSchema,
    schema: workflowChoicePage.schema,
  },
};
