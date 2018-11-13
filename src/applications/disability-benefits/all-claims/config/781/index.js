import { incidentDate, secondaryIncidentDate } from '../../pages';

import { needsToEnter781, needsToEnter781a } from '../../utils';

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
          depends: needsToEnter781,
          uiSchema: incidentDate.uiSchema(index),
          schema: incidentDate.schema(index),
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
          // The Depends will need to be refactored to account for the page index/incident Number
          depends: needsToEnter781a,
          uiSchema: secondaryIncidentDate.uiSchema(index),
          schema: secondaryIncidentDate.schema(index),
        },
      },
    };
  }
  return configObj;
}
