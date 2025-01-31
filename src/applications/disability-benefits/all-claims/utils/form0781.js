// All flippers for the 0781 Papersync should be added to this file
import _ from 'platform/utilities/data';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
import { isClaimingNew } from '.';
import { form0781WorkflowChoices } from '../content/form0781/workflowChoicePage';
import { titleWithTag, form0781HeadingTag } from '../content/form0781';

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

/**
 * Dynamically generates the title for an event page in the array builder pattern.
 *
 * - If the URL contains the 'edit' param, formats the title as "Edit event #{index + 1} {editTitle}",
 *   where `index` is derived from the `id` property in the `props`
 * - Designed for use in `uiSchema` configurations for array events
 *
 * Usage:
 * ```
 * uiSchema: {
 *   ...arrayBuilderEventPageTitleUI({
 *     title: 'Official report',
 *     editTitle: 'details',
 *   }),
 *   ...
 * }
 * ```
 *
 * @param {{
 *   title: string,       // The base title for the page.
 *   editTitle: string,   // The text to append when in edit mode.
 * }} options
 * @returns {UISchemaOptions}
 */
export const arrayBuilderEventPageTitleUI = ({ title, editTitle = '' }) => {
  return titleUI(props => {
    const search = getArrayUrlSearchParams();
    const isEdit = search.get('edit');
    const { id } = props;

    if (isEdit) {
      const match = id.match(/root_(\d+)_/);
      const index = match ? parseInt(match[1], 10) : 0;

      return titleWithTag(
        `Edit event #${index + 1} ${editTitle}`,
        form0781HeadingTag,
      );
    }
    return title;
  });
};
