import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge, pick } from 'lodash';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import fullNameUI from 'platform/forms/definitions/fullName';
import {
  veteranUI,
  ssnDashesUI,
  sponsorDetailsSubHeader,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:title': sponsorDetailsSubHeader,
  'ui:description': applicantDescription,
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
      ssn: {
        ...ssnDashesUI,
        'ui:title': 'Sponsor’s Social Security number',
      },
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
          required: ['ssn'],
          properties: pick(veteran.properties, [
            'currentName',
            'ssn',
            'dateOfBirth',
            'placeOfBirth',
          ]),
        },
      },
    },
  },
};
