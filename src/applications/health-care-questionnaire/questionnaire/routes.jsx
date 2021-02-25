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
// eslint-disable-next-line no-unused-vars
const questionnaire = getCurrentQuestionnaire(window, id);
formConfig.formId = addAppointmentIdToFormId(id, formConfig.formId);

const route = {
  path: '/',
  component: QuestionnaireWrapper,
  indexRoute: {
    onEnter: onFormEnter(id),
  },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
