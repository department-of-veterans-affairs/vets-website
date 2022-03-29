// In a real app this would not be imported directly; instead the schema you
// imported above would import and use these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import toursOfDutyUI from '../definitions/toursOfDuty';

const { toursOfDuty } = commonDefinitions;

const serviceHistoryChapter = {
  title: 'Chapter Title: Service History (Simple array loop)',
  pages: {
    serviceHistory: {
      path: 'service-history',
      title: 'Section Title: Service History',
      uiSchema: {
        toursOfDuty: toursOfDutyUI,
      },
      schema: {
        type: 'object',
        properties: {
          toursOfDuty,
        },
      },
    },
  },
};

export default serviceHistoryChapter;
