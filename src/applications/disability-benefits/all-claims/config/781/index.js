import {
  incidentDate,
  incidentLocation,
  secondaryIncidentDate,
  secondaryIncidentLocation,
} from '../../pages';

import { isAnswering781Questions, isAnswering781aQuestions } from '../../utils';

const numberToWords = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  3: 'Fourth',
  4: 'Fifth',
  5: 'Sixth',
  6: 'Seventh',
  7: 'Eighth',
  8: 'Ninth',
  9: 'Tenth',
};

export function createFormConfig781(iterations) {
  let configObj = {};
  for (let index = 0; index < iterations; index++) {
    configObj = {
      ...configObj,
      // 781 PAGE CONFIGS GO HERE
      [`incidentDate${index}`]: {
        title: `${numberToWords[index]} PTSD incident date`,
        path: `disabilities/ptsd-incident-date-${index}`,
        depends: isAnswering781Questions,
        uiSchema: incidentDate.uiSchema(index),
        schema: incidentDate.schema(index),
      },
      [`incidentLocation${index}`]: {
        title: `${numberToWords[index]} PTSD incident location`,
        path: `disabilities/ptsd-incident-location-${index}`,
        depends: isAnswering781Questions,
        uiSchema: incidentLocation.uiSchema(index),
        schema: incidentLocation.schema(index),
      },
    };
  }
  return configObj;
}

export function createFormConfig781a(iterations) {
  let configObj = {};
  for (let index = 0; index < iterations; index++) {
    configObj = {
      ...configObj,
      // 781a PAGE CONFIGS GO HERE
      [`secondaryIncidentDate${index}`]: {
        title: `${numberToWords[index]} PTSD assault incident date`,
        path: `disabilities/ptsd-secondary-incident-date-${index}`,
        // The Depends will need to be refactored to account for the page index/incident Number
        depends: isAnswering781aQuestions,
        uiSchema: secondaryIncidentDate.uiSchema(index),
        schema: secondaryIncidentDate.schema(index),
      },
      [`secondaryIncidentLocation${index}`]: {
        title: `${numberToWords[index]} PTSD assault incident location`,
        path: `disabilities/ptsd-secondary-incident-location-${index}`,
        depends: isAnswering781aQuestions,
        uiSchema: secondaryIncidentLocation.uiSchema(index),
        schema: secondaryIncidentLocation.schema(index),
      },
    };
  }
  return configObj;
}
