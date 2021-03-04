import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import QuestionnaireWrapper from './containers/QuestionnaireWrapper.jsx';

import {
  addAppointmentIdToFormId,
  getCurrentAppointmentId,
  getCurrentQuestionnaire,
  onFormEnter,
} from '../shared/utils';

const id = getCurrentAppointmentId(window);
const questionnaire = getCurrentQuestionnaire(window, id);
const questionnaireId = questionnaire?.id;
formConfig.formId = addAppointmentIdToFormId(
  formConfig.formId,
  id,
  questionnaireId,
);

const route = {
  path: '/',
  component: QuestionnaireWrapper,
  indexRoute: {
    onEnter: onFormEnter(id),
  },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
