import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import get from '~/platform/utilities/data/get';
import * as toursOfDuty from '../../definitions/toursOfDuty';

export const schemaIsActiveDuty = {
  type: 'object',
  properties: {
    toursOfDuty: toursOfDuty.schema(fullSchema1995, {
      fields: ['serviceBranch', 'dateRange'],
      required: ['serviceBranch', 'dateRange.from'],
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    toursOfDuty: toursOfDuty.schema(fullSchema1995, {
      fields: ['serviceBranch', 'dateRange'],
      required: ['serviceBranch', 'dateRange.from'],
    }),
  },
};

export const uiSchema = {
  toursOfDuty: {
    ...toursOfDuty.uiSchema,
    'ui:options': {
      ...toursOfDuty.uiSchema['ui:options'],
    },
    'ui:required': formData => get('view:newService', formData),
  },
};
