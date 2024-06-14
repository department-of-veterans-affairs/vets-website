import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import fullNameUI from 'platform/forms/definitions/fullName';
import {
  veteranUI,
  sponsorDetailsSubHeader,
  ssnDashesUI,
  sponsorDetailsGuidingText,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:title': (formContext, formData) =>
    sponsorDetailsSubHeader(formContext, formData),
  application: {
    veteran: merge({}, veteranUI, {
      'view:sponsorDetailsDescription': {
        'ui:description': sponsorDetailsGuidingText,
        'ui:options': {
          displayEmptyObjectOnReview: true,
        },
      },
      currentName: merge({}, fullNameUI, {
        first: {
          'ui:title': 'Sponsor’s first name',
        },
        last: {
          'ui:title': 'Sponsor’s last name',
        },
        middle: {
          'ui:title': 'Sponsor’s middle name',
        },
        suffix: {
          'ui:title': 'Sponsor’s suffix',
        },
        maiden: {
          'ui:title': 'Sponsor’s maiden name',
        },
        'ui:order': ['first', 'middle', 'last', 'suffix', 'maiden'],
      }),
      ssn: {
        ...ssnDashesUI,
        'ui:title': 'Sponsor’s Social Security number',
      },
      dateOfBirth: currentOrPastDateUI('Sponsor’s date of birth'),
      cityOfBirth: {
        'ui:title': "Sponsor's birth city or county",
      },
      stateOfBirth: {
        'ui:title': "Sponsor's birth state or territory",
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
          required: ['ssn', 'cityOfBirth', 'stateOfBirth'],
          properties: merge(
            {},
            {
              'view:sponsorDetailsDescription': {
                type: 'object',
                properties: {},
              },
            },
            pick(veteran.properties, [
              'currentName',
              'ssn',
              'dateOfBirth',
              'cityOfBirth',
              'stateOfBirth',
            ]),
          ),
        },
      },
    },
  },
};
