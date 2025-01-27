// All flippers for the 0781 Papersync should be added to this file
import _ from 'platform/utilities/data';
import { isClaimingNew } from '.';
import { form0781WorkflowChoices } from '../content/form0781/workflowChoicePage';

/**
 * Helper method to determin if a series of veteran selections match ONLY
 * the condition of type === combat
 */
function combatOnlySelection(formData) {
  const eventTypes = formData?.mentalHealth?.eventTypes || {};
  // ensure the Vet has only selected the 'combat' event type
  const combatSelected = eventTypes.combat;
  const nonCombatSelections = Object.keys(eventTypes)
    .filter(key => key !== 'combat')
    .some(key => eventTypes[key]);
  return combatSelected && !nonCombatSelections;
}

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

/*
 * @returns
 *   TRUE
 *     - IF Vetern should see 0781 pages
 *       - AND is not seeing the 'Combat Only' version of this page
 */
export function showBehaviorIntroPage(formData) {
  return isCompletingForm0781(formData) && !combatOnlySelection(formData);
}

/*
 * @returns
 *   FALSE
 *     - IF Vetern has ONLY selected "Traumatic Events Related To Comabt"
 *       - AND has explicitly opted out of providing more info
 *     - ELSE IF Veteran should not see 0781 pages
 *   TRUE
 *     - in all other cases
 */
export function showBehaviorIntroCombatPage(formData) {
  return isCompletingForm0781(formData) && combatOnlySelection(formData);
}

/*
 * @returns
 *   FALSE
 *     - IF Vetern has ONLY selected "Traumatic Events Related To Comabt"
 *       - AND has explicitly opted out of providing more info
 *     - ELSE IF Veteran should not see 0781 pages
 *   TRUE
 *     - in all other cases
 */
export function showBehaviorListPage(formData) {
  const answerQuestions =
    _.get('view:answerCombatBehaviorQuestions', formData, 'false') === 'true';

  return (
    isCompletingForm0781(formData) &&
    ((showBehaviorIntroCombatPage(formData) && answerQuestions) ||
      !combatOnlySelection(formData))
  );
}
