import {
  incidentDate,
  incidentLocation,
  secondaryIncidentDate,
  secondaryIncidentLocation,
} from '../../pages';

import { isAnswering781Questions, isAnswering781aQuestions } from '../../utils';

export function formConfig781(iterations) {
  let configObj = {};
  for (let index = 0; index < iterations; index++) {
    configObj = {
      ...configObj,
      // 781 PAGE CONFIGS GO HERE
      ...{
        [`incidentDate${index}`]: {
          title: `781 PTSD Incident date ${index + 1}`,
          path: `disabilities/ptsd-incident-date-${index}`,
          depends: isAnswering781Questions,
          uiSchema: incidentDate.uiSchema(index),
          schema: incidentDate.schema(index),
        },
        [`incidentLocation${index}`]: {
          title: `PTSD 781 ${index + 1} incident location`,
          path: `disabilities/ptsd-incident-location-${index}`,
          depends: isAnswering781Questions,
          uiSchema: incidentLocation.uiSchema(index),
          schema: incidentLocation.schema(index),
        },
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
      ...{
        [`secondaryIncidentDate${index}`]: {
          title: `781a PTSD Incident date ${index + 1}`,
          path: `disabilities/ptsd-secondary-incident-date-${index}`,
          // The Depends will need to be refactored to account for the page index/incident Number
          depends: isAnswering781aQuestions,
          uiSchema: secondaryIncidentDate.uiSchema(index),
          schema: secondaryIncidentDate.schema(index),
        },
        [`secondaryIncidentLocation${index}`]: {
          title: `PTSD 781a ${index + 1} incident location`,
          path: `disabilities/ptsd-secondary-incident-location-${index}`,
          depends: isAnswering781aQuestions,
          uiSchema: secondaryIncidentLocation.uiSchema(index),
          schema: secondaryIncidentLocation.schema(index),
        },
      },
    };
  }
  return configObj;
}
