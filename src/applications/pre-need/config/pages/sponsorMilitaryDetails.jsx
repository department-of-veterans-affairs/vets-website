import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';
import { merge, pick } from 'lodash';

import environment from 'platform/utilities/environment';

import {
  sponsorMilitaryDetailsSubHeader,
  sponsorMilitaryStatusDescription,
  veteranUI,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:title': sponsorMilitaryDetailsSubHeader,
  application: {
    veteran: merge({}, veteranUI, {
      militaryServiceNumber: {
        // prod flag for MBMS-47182
        'ui:title': environment.isProduction()
          ? 'Sponsor’s military Service number (if they have one that’s different than their Social Security number)'
          : 'Sponsor’s military Service number (if it’s different than their Social Security number)',
        'ui:errorMessages': {
          pattern:
            'Sponsor’s Military Service number must be between 4 to 9 characters',
        },
      },
      vaClaimNumber: {
        'ui:title': 'Sponsor’s VA claim number (if known)',
        'ui:errorMessages': {
          pattern: 'Sponsor’s VA claim number must be 8 or 9 digits',
        },
      },
      militaryStatus: {
        'ui:title':
          'Sponsor’s current military status (You can add more service history information later in this application.)',
        'ui:options': {
          nestedContent: {
            X: sponsorMilitaryStatusDescription,
          },
        },
      },
    }),
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
          properties: pick(veteran.properties, [
            'militaryServiceNumber',
            'vaClaimNumber',
            'militaryStatus',
          ]),
        },
      },
    },
  },
};
