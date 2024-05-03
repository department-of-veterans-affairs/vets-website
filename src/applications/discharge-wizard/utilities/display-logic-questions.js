import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { SHORT_NAME_MAP } from '../constants/question-data-map';

/** ================================================================
 * Make a roadmap (in display order) of SHORT_NAMEs that display in the flow
 *
 */
export const makeRoadmap = () => {
  return Object.keys(SHORT_NAME_MAP);
};

/** ================================================================
 * Check form responses to see if they match the requirements in DISPLAY_CONDITIONS
 *
 * @param {array} requiredResponses Example: [NO, NOT_SURE]
 * @param {string} formResponse - answer in the store
 */
export const responseMatchesRequired = (requiredResponses, formResponse) => {
  return requiredResponses?.includes(formResponse);
};

/** ================================================================
 * Function for evaluating whether a question should display, takes into account "forked" display conditions
 * where there could be multiple cases for a single question to display in the logic flow.
 *
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 */
export const displayConditionsMet = (SHORT_NAME, formResponses) => {
  const displayConditionsForShortName = DISPLAY_CONDITIONS[SHORT_NAME];
  const questionRequirements = Object.keys(displayConditionsForShortName);

  if (questionRequirements.includes('FORK')) {
    const forkedReqs = displayConditionsForShortName?.FORK;
    let anyForkConditionsMet = false;

    // Iterates through the entries available for the current questions reqs.
    for (const forkIndex of Object.keys(forkedReqs)) {
      const forkConditions = forkedReqs[forkIndex];
      let allConditionsMet = true;

      // Iterates through the responses required and checks for valid conditions.
      for (const conditionKey of Object.keys(forkConditions)) {
        const requiredResponses = forkConditions[conditionKey];
        const formResponse = formResponses?.[conditionKey];

        if (
          !responseMatchesRequired(requiredResponses, formResponse) &&
          requiredResponses.length
        ) {
          allConditionsMet = false;
          break;
        }
      }
      if (allConditionsMet) {
        anyForkConditionsMet = true;
        break;
      }
    }
    return anyForkConditionsMet;
  }

  for (const questionShortName of questionRequirements) {
    const formResponse = formResponses?.[questionShortName];

    const requiredResponses = displayConditionsForShortName[questionShortName];

    if (
      !responseMatchesRequired(requiredResponses, formResponse) &&
      requiredResponses.length // This is for display conditions that can be any value ex: branch of service, year, month
    ) {
      return false;
    }
  }
  return true;
};
