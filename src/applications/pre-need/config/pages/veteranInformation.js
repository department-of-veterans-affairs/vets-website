import { pick } from 'lodash';

import set from 'platform/utilities/data/set';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { veteranUI } from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    veteran: veteranUI,
  },
};

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          required: ['race', 'gender', 'maritalStatus', 'militaryStatus'],
          properties: set(
            'militaryStatus.enum',
            veteran.properties.militaryStatus.enum.filter(
              // Doesn't make sense to have options for the
              // Veteran to say they're deceased
              opt => !['I', 'D'].includes(opt),
            ),
            pick(veteran.properties, [
              'militaryServiceNumber',
              'vaClaimNumber',
              'placeOfBirth',
              'gender',
              'race',
              'maritalStatus',
              'militaryStatus',
            ]),
          ),
        },
      },
    },
  },
};
