import { ROUTES } from '../constants';
import { DISPLAY_CONDITIONS } from '../constants/display-conditions';
import { SHORT_NAME_MAP } from '../constants/question-data-map';
import { determineYearRoute, determineReasonRoute } from './shared';

export const nextQuestionRoute = (currentQuestion, answer) => {
  let nextRoute;

  switch (currentQuestion) {
    case SHORT_NAME_MAP.SERVICE_BRANCH:
      nextRoute = SHORT_NAME_MAP.DISCHARGE_YEAR;
      break;
    case SHORT_NAME_MAP.DISCHARGE_YEAR:
      nextRoute = determineYearRoute(answer);
      break;
    case SHORT_NAME_MAP.DISCHARGE_MONTH:
      nextRoute = SHORT_NAME_MAP.REASON;
      break;
    case SHORT_NAME_MAP.REASON:
      nextRoute = determineReasonRoute(answer);
      break;
    case SHORT_NAME_MAP.DISCHARGE_TYPE:
      nextRoute = SHORT_NAME_MAP.INTENTION;
      break;
    case SHORT_NAME_MAP.INTENTION:
      nextRoute = SHORT_NAME_MAP.COURT_MARTIAL;
      break;
    case SHORT_NAME_MAP.COURT_MARTIAL:
      nextRoute = SHORT_NAME_MAP.PREVIOUS_APPLICATION;
      break;
    default:
      return ROUTES.RESULTS;
  }
  return nextRoute;
};

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
 * Function for evaluating whether a question should display
 *
 * @param {string} SHORT_NAME - name for the current question
 * @param {object} formResponses - all answers in the store
 */
export const displayConditionsMet = (SHORT_NAME, formResponses) => {
  const displayConditionsForShortName = DISPLAY_CONDITIONS[SHORT_NAME];
  const questionRequirements = Object.keys(displayConditionsForShortName);

  for (const questionShortName of questionRequirements) {
    const formResponse = formResponses?.[questionShortName];
    const requiredResponses = displayConditionsForShortName[questionShortName];

    if (
      !responseMatchesRequired(requiredResponses, formResponse) &&
      requiredResponses.length // This is for display conditions that can be any value ex: year, month
    ) {
      return false;
    }
  }
  return true;
};
