import {
  incidentDate,
  incidentUnitAssignment,
  secondaryIncidentDate,
  secondaryIncidentUnitAssignment,
} from '../../pages';

import { isAnswering781Questions, isAnswering781aQuestions } from '../../utils';

const numberToWords = {
  0: 'first',
  1: 'second',
  2: 'third',
  3: 'fourth',
  4: 'fifth',
  5: 'sixth',
  6: 'seventh',
  7: 'eighth',
  8: 'ninth',
  9: 'tenth',
};

export function formConfig781(iterations) {
  let configObj = {};
  for (let index = 0; index < iterations; index++) {
    const iterationNumber = numberToWords[index];
    configObj = {
      ...configObj,
      // 781 PAGE CONFIGS GO HERE
      ...{
        [`incidentDate${index}`]: {
          title: `PTSD 781 ${iterationNumber} incident date`,
          path: `disabilities/ptsd-incident-date-${index}`,
          depends: isAnswering781Questions,
          uiSchema: incidentDate.uiSchema(index),
          schema: incidentDate.schema(index),
        },
        [`incidentUnitAssignment${index}`]: {
          title: `PTSD 781 ${iterationNumber} incident unit assignment`,
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
    const iterationNumber = numberToWords[index];
    configObj = {
      ...configObj,
      // 781a PAGE CONFIGS GO HERE
      ...{
        [`secondaryIncidentDate${index}`]: {
          title: `PTSD 781a ${iterationNumber} incident date`,
          path: `disabilities/ptsd-secondary-incident-date-${index}`,
          depends: isAnswering781aQuestions,
          uiSchema: secondaryIncidentDate.uiSchema(index),
          schema: secondaryIncidentDate.schema(index),
        },
        [`secondaryIncidentUnitAssignment${index}`]: {
          title: `PTSD 781a ${iterationNumber} incident unit assignment`,
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
