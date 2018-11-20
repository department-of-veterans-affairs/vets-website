import {
  incidentDate,
  secondaryIncidentDate,
  eventDescription,
  secondaryEventDescription,
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

export function formConfig781(iterations) {
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
      [`eventDescription${index}`]: {
        title: `${numberToWords[index]} 781 PTSD Event Description`,
        path: `disabilities/ptsd-event-description-${index}`,
        depends: isAnswering781Questions,
        uiSchema: eventDescription.uiSchema(index),
        schema: eventDescription.schema(index),
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
        title: `${numberToWords[index]} 781a PTSD Incident date`,
        path: `disabilities/ptsd-secondary-incident-date-${index}`,
        // The Depends will need to be refactored to account for the page index/incident Number
        depends: isAnswering781aQuestions,
        uiSchema: secondaryIncidentDate.uiSchema(index),
        schema: secondaryIncidentDate.schema(index),
      },
      [`secondaryEventDescription${index}`]: {
        title: `${numberToWords[index]} 781a PTSD Event Description`,
        path: `disabilities/ptsd-secondaryEvent-description-${index}`,
        depends: isAnswering781aQuestions,
        uiSchema: secondaryEventDescription.uiSchema(index),
        schema: secondaryEventDescription.schema(index),
      },
    };
  }
  return configObj;
}
