import {
  incidentDate,
  secondaryIncidentDate,
  incidentDescription,
  secondaryIncidentDescription,
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
        title: `${numberToWords[index]} 781 PTSD Incident date`,
        path: `disabilities/ptsd-incident-date-${index}`,
        depends: isAnswering781Questions,
        uiSchema: incidentDate.uiSchema(index),
        schema: incidentDate.schema(index),
      },
      [`incidentDescription${index}`]: {
        title: `${numberToWords[index]} 781 PTSD Event Description`,
        path: `disabilities/ptsd-incident-description-${index}`,
        depends: isAnswering781Questions,
        uiSchema: incidentDescription.uiSchema(index),
        schema: incidentDescription.schema(index),
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
        title: `${numberToWords[index]} 781a PTSD Incident date`,
        path: `disabilities/ptsd-secondary-incident-date-${index}`,
        // The Depends will need to be refactored to account for the page index/incident Number
        depends: isAnswering781aQuestions,
        uiSchema: secondaryIncidentDate.uiSchema(index),
        schema: secondaryIncidentDate.schema(index),
      },
      [`secondaryIncidentDescription${index}`]: {
        title: `${numberToWords[index]} 781a PTSD Event Description`,
        path: `disabilities/ptsd-secondary-incident-description-${index}`,
        depends: isAnswering781aQuestions,
        uiSchema: secondaryIncidentDescription.uiSchema(index),
        schema: secondaryIncidentDescription.schema(index),
      },
    };
  }
  return configObj;
}
