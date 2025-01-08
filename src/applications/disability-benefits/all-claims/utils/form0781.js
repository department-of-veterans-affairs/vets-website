// All flippers for the 0781 Papersync should be added to this file
import { isClaimingNew } from '.';
import { form0781WorkflowChoices } from '../content/form0781/workflowChoicePage';

/**
 * Checks if the modern 0781 flow should be shown if the flipper is active for this veteran
 * All 0781 page-specific flippers should include a check against this top level flipper
 *
 * @returns
 *   TRUE if
 *     - is set on form via the backend
 *     - Veteran is claiming a new disability
 *     - Veteran has selected connected condition choices on 'screener page'
 *   else
 *     - returns false
 */
export function showForm0781Pages(formData) {
  const conditions = formData?.mentalHealth?.conditions || {};
  return (
    formData?.syncModern0781Flow === true &&
    isClaimingNew(formData) &&
    Object.entries(conditions).some(
      ([key, value]) => key !== 'none' && value === true,
    )
  );
}

export function showManualUpload0781Page(formData) {
  return (
    showForm0781Pages(formData) &&
    formData['view:mentalHealthWorkflowChoice'] ===
      form0781WorkflowChoices.SUBMIT_PAPER_FORM
  );
}

/**
 * Checks if
 * 1. modern 0781 pages should be showing
 * 2. the option to complete the online form is selected
 *
 * @param {object} formData
 * @returns {boolean} true if COMPLETE_ONLINE_FORM is selected, false otherwise
 */
export function isCompletingForm0781(formData) {
  return (
    showForm0781Pages(formData) &&
    formData['view:mentalHealthWorkflowChoice'] ===
      form0781WorkflowChoices.COMPLETE_ONLINE_FORM
  );
}

export function isRelatedToMST(formData) {
  return (
    isCompletingForm0781(formData) &&
    formData?.mentalHealth?.eventTypes?.mst === true
  );
}
