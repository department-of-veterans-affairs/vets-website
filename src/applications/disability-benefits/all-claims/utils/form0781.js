// All flippers for the 0781 Papersync should be added to this file
import _ from 'platform/utilities/data';
import { isClaimingNew } from '.';
import { form0781WorkflowChoices } from '../content/form0781';

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

/**
 * Checks if
 * 1. modern 0781 pages should be showing
 * 2. the option to complete the online form is selected
 * 3. MST is selected as a mentalHealth eventType
 *
 * @param {object} formData
 * @returns {boolean} true if MST is selected, false otherwise
 */
export function isRelatedToMST(formData) {
  return (
    isCompletingForm0781(formData) &&
    formData?.mentalHealth?.eventTypes?.mst === true
  );
}
/**
 * Checks if
 * 1. the option to complete the online form is selected
 * 2. the user is adding an event
 *
 * @param {object} formData
 * @returns {boolean} true if Add an event is selected, false otherwise
 */
export function isAddingEvent(formData) {
  return isCompletingForm0781(formData) && formData['view:addEvent'] === true;
}

/**
 * Checks if
 * 1. the user is adding an event
 * 2. official police report exists option is selected
 *
 * @param {object} formData
 * @returns {boolean} true if police report is selected, false otherwise
 */
export const policeReportSelected = index => formData =>
  isAddingEvent(formData) &&
  _.get(`event${index}.reports.police`, formData, false);
