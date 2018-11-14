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
          title: 'PTSD Incident Date',
          path: `disabilities/ptsd-incident-date-${index}`,
          depends: isAnswering781Questions,
          uiSchema: incidentDate.uiSchema(index),
          schema: incidentDate.schema(index),
        },
        [`incidentLocation${index}`]: {
          title: 'PTSD Incident Location',
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
          title: 'PTSD Incident Date',
          path: `disabilities/ptsd-secondary-incident-date-${index}`,
          depends: isAnswering781aQuestions,
          uiSchema: secondaryIncidentDate.uiSchema(index),
          schema: secondaryIncidentDate.schema(index),
        },
        [`secondaryIncidentLocation${index}`]: {
          title: 'PTSD Incident Location',
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
