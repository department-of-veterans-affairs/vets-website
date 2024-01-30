import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { pick } from 'lodash';
import set from 'platform/utilities/data/set';
import { militaryDetailsSubHeader, veteranUI } from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    'ui:title': militaryDetailsSubHeader,
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
          required: ['militaryStatus'],
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
              'militaryStatus',
            ]),
          ),
        },
      },
    },
  },
};
