import {
  incidentSupport,
  incidentDate,
  secondaryIncidentDate,
  secondaryIncidentPermissionNotice,
  secondaryIncidentAuthorities,
  ptsdAdditionalEvents,
  ptsdSecondaryAdditionalEvents,
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
      [`incidentSupport${index}`]: {
        title: `${numberToWords[index]} PTSD incident support`,
        path: `disabilities/ptsd-incident-support-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentSupport.uiSchema('781'),
        schema: incidentSupport.schema,
      },
      [`incidentDate${index}`]: {
        title: `${numberToWords[index]} PTSD incident date`,
        path: `disabilities/ptsd-incident-date-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: incidentDate.uiSchema(index),
        schema: incidentDate.schema(index),
      },
      // This should be the last page in the config loop
      [`ptsdAdditionalEvents${index}`]: {
        title: `${numberToWords[index]} Combat PTSD Additional events.`,
        path: `disabilities/ptsd-additional-events-${index}`,
        depends: isAnswering781Questions(index),
        uiSchema: ptsdAdditionalEvents.uiSchema(index),
        schema: ptsdAdditionalEvents.schema(index),
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
      [`secondaryIncidentSupport${index}`]: {
        title: `${numberToWords[index]} PTSD assault incident support`,
        path: `disabilities/ptsd-secondary-incident-support-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: incidentSupport.uiSchema('781a'),
        schema: incidentSupport.schema,
      },
      [`secondaryIncidentDate${index}`]: {
        title: `${numberToWords[index]} PTSD assault incident date`,
        path: `disabilities/ptsd-secondary-incident-date-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryIncidentDate.uiSchema(index),
        schema: secondaryIncidentDate.schema(index),
      },
      [`secondaryIncidentPermissionNotice${index}`]: {
        title: `${numberToWords[index]} PTSD assault permission notice`,
        path: `disabilities/ptsd-secondary-permission-notice-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryIncidentPermissionNotice.uiSchema,
        schema: secondaryIncidentPermissionNotice.schema,
      },
      [`secondaryIncidentAuthorities${index}`]: {
        title: `${numberToWords[index]} PTSD assault authorities`,
        path: `disabilities/ptsd-secondary-authorities-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: secondaryIncidentAuthorities.uiSchema(index),
        schema: secondaryIncidentAuthorities.schema(index),
      },
      // This should be the last page in the config loop
      [`ptsdSecondaryAdditionalEvents${index}`]: {
        title: `${numberToWords[index]} Assault PTSD Additional events.`,
        path: `disabilities/ptsd-781a-additional-events-${index}`,
        depends: isAnswering781aQuestions(index),
        uiSchema: ptsdSecondaryAdditionalEvents.uiSchema(index),
        schema: ptsdSecondaryAdditionalEvents.schema(index),
      },
    };
  }
  return configObj;
}
