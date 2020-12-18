import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import QuestionnaireWrapper from './containers/QuestionnaireWrapper.jsx';

import { getCurrentAppointmentId, addAppointmentIdToFormId } from './utils';

const id = getCurrentAppointmentId(window);
formConfig.formId = addAppointmentIdToFormId(id, formConfig.formId);

const route = {
  path: '/',
  component: QuestionnaireWrapper,
  indexRoute: {
    onEnter: (nextState, replace) => {
      if (id) {
        replace(`/introduction?id=${id}`);
      } else {
        // replace('/error');
        replace(`/health-care/health-questionnaires/questionnaires`);
      }
    },
  },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
