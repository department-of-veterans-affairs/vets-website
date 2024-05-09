import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';
import { merge, pick } from 'lodash';
import set from 'platform/utilities/data/set';

import {
  VAClaimNumberAdditionalInfo,
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
        'ui:title': 'Sponsor’s Military Service number',
        'ui:options': {
          enableAnalytics: false,
          hint: 'If it’s different than their Social Security number',
        },
        'ui:errorMessages': {
          pattern:
            'Sponsor’s Military Service number must be between 4 to 9 characters',
        },
      },
      vaClaimNumber: {
        'ui:title': 'Sponsor’s VA claim number',
        'ui:options': {
          enableAnalytics: false,
          hint: 'If they don’t have a VA claim number, leave this blank.',
        },
        'ui:errorMessages': {
          pattern: 'Sponsor’s VA claim number must be 8 or 9 digits',
        },
      },
      militaryStatus: {
        'ui:title': 'Sponsor’s current military status',
        'ui:options': {
          nestedContent: {
            X: sponsorMilitaryStatusDescription,
          },
          enableAnalytics: false,
          hint:
            'You can add more service history information later in this application.',
          labels: {
            A: 'Active duty',
            S: 'Reserve/National Guard',
            R: 'Retired',
            E: 'Retired active duty',
            O: 'Retired Reserve/National Guard',
            V: 'Veteran',
            X: 'Other',
          },
        },
      },
    }),
    'view:contactInfoDescription': {
      'ui:description': VAClaimNumberAdditionalInfo,
      'ui:options': {
        displayEmptyObjectOnReview: true,
      },
    },
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
              'militaryStatus',
              'militaryServiceNumber',
              'vaClaimNumber',
            ]),
          ),
        },
        'view:contactInfoDescription': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
