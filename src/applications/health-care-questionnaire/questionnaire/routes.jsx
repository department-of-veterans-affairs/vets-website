import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import QuestionnaireWrapper from './containers/QuestionnaireWrapper.jsx';

import {
  getCurrentAppointmentId,
  addAppointmentIdToFormId,
  onFormEnter,
} from './utils';

const id = getCurrentAppointmentId(window);
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
