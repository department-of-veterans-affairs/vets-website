import {
  incidentDate,
  incidentLocation,
  secondaryIncidentDate,
  secondaryIncidentLocation,
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
        [`incidentLocation${index}`]: {
          title: `PTSD 781 ${iterationNumber} incident location`,
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
        [`secondaryIncidentLocation${index}`]: {
          title: `PTSD 781a ${iterationNumber} incident location`,
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
