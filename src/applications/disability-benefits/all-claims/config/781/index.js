import {
  incidentInfo,
  incidentDate,
  incidentUnitAssignment,
  secondaryIncidentDate,
  secondaryIncidentUnitAssignment,
} from '../../pages';

import { isAnswering781Questions, isAnswering781aQuestions } from '../../utils';

export function formConfig781(iterations) {
  let configObj = {};
  for (let index = 0; index < iterations; index++) {
    configObj = {
      ...configObj,
      // 781 PAGE CONFIGS GO HERE
      ...{
        [`incidentInfo${index}`]: {
          title: `781 PTSD Incident info ${index + 1}`,
          path: `disabilities/ptsd-incident-info-${index}`,
          depends: isAnswering781Questions,
          uiSchema: incidentInfo.uiSchema('781'),
          schema: incidentInfo.schema,
        },
        [`incidentDate${index}`]: {
          title: `781 PTSD Incident date ${index + 1}`,
          path: `disabilities/ptsd-incident-date-${index}`,
          depends: isAnswering781Questions,
          uiSchema: incidentDate.uiSchema(index),
          schema: incidentDate.schema(index),
        },
        [`incidentUnitAssignment${index}`]: {
          title: `PTSD 781 ${index + 1} incident unit assignment`,
          path: `disabilities/ptsd-incident-unit-assignment-${index}`,
          depends: isAnswering781Questions,
          uiSchema: incidentUnitAssignment.uiSchema(index),
          schema: incidentUnitAssignment.schema(index),
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
        [`secondaryIncidentInfo${index}`]: {
          title: `781a PTSD Incident info ${index + 1}`,
          path: `disabilities/ptsd-secondary-incident-info-${index}`,
          depends: isAnswering781aQuestions,
          uiSchema: incidentInfo.uiSchema('781a'),
          schema: incidentInfo.schema,
        },
        [`secondaryIncidentDate${index}`]: {
          title: `781a PTSD Incident date ${index + 1}`,
          path: `disabilities/ptsd-secondary-incident-date-${index}`,
          depends: isAnswering781aQuestions,
          uiSchema: secondaryIncidentDate.uiSchema(index),
          schema: secondaryIncidentDate.schema(index),
        },
        [`secondaryIncidentUnitAssignment${index}`]: {
          title: `PTSD 781a ${index + 1} incident unit assignment`,
          path: `disabilities/ptsd-secondary-incident-unit-assignment-${index}`,
          depends: isAnswering781Questions,
          uiSchema: secondaryIncidentUnitAssignment.uiSchema(index),
          schema: secondaryIncidentUnitAssignment.schema(index),
        },
      },
    };
  }
  return configObj;
}
