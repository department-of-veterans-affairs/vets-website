import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import fullNameUI from 'platform/forms/definitions/fullName';
import { veteranUI, sponsorDetailsSubHeader } from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:title': sponsorDetailsSubHeader,
  application: {
    veteran: merge({}, veteranUI, {
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
      dateOfBirth: currentOrPastDateUI('Sponsor’s date of birth'),
      placeOfBirth: {
        'ui:title': "Sponsor's place of birth (City, State, or Territory)",
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
          properties: merge(
            {},
            pick(veteran.properties, [
              'currentName',
              'dateOfBirth',
              'placeOfBirth',
            ]),
          ),
        },
      },
    },
  },
};
