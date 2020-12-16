import { createRoutesWithSaveInProgress } from 'platform/forms/save-in-progress/helpers';
import formConfig from './config/form';
import QuestionnaireWrapper from './containers/QuestionnaireWrapper.jsx';

import { getAppointmentIdFromUrl, addAppointmentIdToFormId } from './utils';

const id = getAppointmentIdFromUrl(window);
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
        replace(`/introduction`);
      }
    },
  },

  childRoutes: createRoutesWithSaveInProgress(formConfig),
};

export default route;
