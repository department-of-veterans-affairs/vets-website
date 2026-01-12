// All flippers for the 0781 Papersync should be added to this file
import _ from 'platform/utilities/data';
import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder/helpers';
// import { form0781WorkflowChoices } from '../content/form0781/workflowChoicePage';
import { form0781WorkflowChoices } from '../content/form0781/workflowChoices';
import { titleWithTag, form0781HeadingTag } from '../content/form0781';
import { hasSelectedBehaviors } from '../content/form0781/behaviorListPages';

/**
 * Helper method to determine if a series of veteran selections match ONLY
 * the condition of type === combat
 */
function combatOnlySelection(formData) {
  const eventTypes = formData?.eventTypes || {};
  // ensure the Vet has only selected the 'combat' event type
  const combatSelected = eventTypes.combat;
  const nonCombatSelections = Object.keys(eventTypes)
    .filter(key => key !== 'combat')
    .some(key => eventTypes[key]);
  return combatSelected && !nonCombatSelections;
}

/**
 * Checks if a condition is a placeholder rated disability.
 * @param {string} v - condition string
 * @returns {boolean} true if it's a placeholder
 */
const isPlaceholderRated = v => v === 'Rated Disability';

/**
 * Checks if there is at least one valid new condition.
 * A valid new condition has a non-empty condition string and is not a placeholder.
 *
 * @param {object} formData - full form data
 * @returns {boolean} true if there is at least one valid new condition
 */
const hasValidNewCondition = formData =>
  Array.isArray(formData?.newDisabilities) &&
  formData.newDisabilities.some(
    d =>
      typeof d?.condition === 'string' &&
      d.condition.trim().length > 0 &&
      !isPlaceholderRated(d.condition), // excludes Rated Disability
  );

/**
 * Checks if the modern 0781 flow should be shown.
 * Shows when the syncModern0781Flow flag is true AND there is at least one
 * valid new condition. This logic works for both legacy and new conditions
 * workflows without relying on view:claimType.
 *
 * @param {object} formData - full form data
 * @returns {boolean} true if 0781 pages should show
 */
export function showForm0781Pages(formData) {
  return (
    formData?.syncModern0781Flow === true && hasValidNewCondition(formData)
  );
}

export function showManualUpload0781Page(formData) {
  return (
    showForm0781Pages(formData) &&
    formData.mentalHealthWorkflowChoice ===
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
    formData.mentalHealthWorkflowChoice ===
      form0781WorkflowChoices.COMPLETE_ONLINE_FORM
  );
}

/**
 * Checks if
 * 1. modern 0781 pages should be showing
 * 2. the option to complete the online form is selected
 * 3. MST is selected as an eventType
 *
 * @param {object} formData
 * @returns {boolean} true if MST is selected, false otherwise
 */
export function isRelatedToMST(formData) {
  return isCompletingForm0781(formData) && formData?.eventTypes?.mst === true;
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
 *     - IF Vetern has ONLY selected "Traumatic Events Related To Combat"
 *       - AND has explicitly opted out of providing more info
 *     - ELSE IF Veteran should not see 0781 pages
 *   TRUE
 *     - in all other cases
 */
export function showBehaviorListPage(formData) {
  const answerQuestions =
    _.get('answerCombatBehaviorQuestions', formData, 'false') === 'true';

  return (
    isCompletingForm0781(formData) &&
    ((showBehaviorIntroCombatPage(formData) && answerQuestions) ||
      !combatOnlySelection(formData))
  );
}

/**
 * Checks if a specific behavior description page should display for selected behavior type. It should display if:
 * 1. modern 0781 pages should be showing
 * 2. the given checkbox formData has a value of true
 *
 * @param {object} formData - full form data
 * @param {string} behaviorSection - selected behavior section
 * @param {string} behaviorType - selected behavior type
 * @returns {boolean} true if the page should display, false otherwise
 */
export function showBehaviorDescriptionsPage(
  formData,
  behaviorSection,
  behaviorType,
) {
  return (
    isCompletingForm0781(formData) &&
    formData?.[behaviorSection]?.[behaviorType] === true
  );
}

export function showUnlistedDescriptionPage(formData) {
  return (
    isCompletingForm0781(formData) &&
    formData?.otherBehaviors?.unlisted === true
  );
}

export function showBehaviorSummaryPage(formData) {
  return isCompletingForm0781(formData) && hasSelectedBehaviors(formData);
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
  return props => {
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
  };
};
