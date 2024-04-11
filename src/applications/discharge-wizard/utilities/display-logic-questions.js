import { ROUTES } from '../constants';
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
