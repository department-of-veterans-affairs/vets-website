import * as toursOfDuty from '../../definitions/toursOfDuty';
import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

export const uiSchema = {
  'view:newService': {
    'ui:title':
      'Do you have any new periods of service to record since you last applied for education benefits?',
    'ui:widget': 'yesNo',
  },
  toursOfDuty: {
    ...toursOfDuty.uiSchema,
    'ui:options': {
      ...toursOfDuty.uiSchema['ui:options'],
      expandUnder: 'view:newService',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:newService': {
      type: 'boolean',
    },
    toursOfDuty: fullSchema1995.properties.toursOfDuty,
  },
};
