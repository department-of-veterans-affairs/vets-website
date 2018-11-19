import { incidentDate, secondaryIncidentDate } from '../../pages';

import { isAnswering781Questions, isAnswering781aQuestions } from '../../utils';

export function formConfig781(iterations) {
  let configObj = {};
  for (let index = 0; index < iterations; index++) {
    configObj = {
      ...configObj,
      // 781 PAGE CONFIGS GO HERE
      [`incidentDate${index}`]: {
        title: `781 PTSD Incident date ${index + 1}`,
        path: `disabilities/ptsd-incident-date-${index}`,
        depends: isAnswering781Questions,
        uiSchema: incidentDate.uiSchema(index),
        schema: incidentDate.schema(index),
      },
    };
  }
  return configObj;
}

export function formConfig781a(iterations) {
  let configObj = {};
  for (let index = 0; index < iterations; index++) {
    configObj = {
      ...configObj,
      // 781a PAGE CONFIGS GO HERE
      [`secondaryIncidentDate${index}`]: {
        title: `781a PTSD Incident date ${index + 1}`,
        path: `disabilities/ptsd-secondary-incident-date-${index}`,
        // The Depends will need to be refactored to account for the page index/incident Number
        depends: isAnswering781aQuestions,
        uiSchema: secondaryIncidentDate.uiSchema(index),
        schema: secondaryIncidentDate.schema(index),
      },
    };
  }
  return configObj;
}
