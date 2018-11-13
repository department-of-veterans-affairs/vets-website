import { incidentDate } from '../../pages';

import { needsToEnter781 } from '../../utils';

export function formConfig781(index) {
  return {
    // Each page config for 781 will be dumped in here and iterated through.
    [`incidentDate${index}`]: {
      title: 'PTSD Incident Date',
      path: `disabilities/ptsd-incident-date-${index}`,
      depends: needsToEnter781,
      uiSchema: incidentDate.uiSchema(index),
      schema: incidentDate.schema(index),
    },
  };
}
