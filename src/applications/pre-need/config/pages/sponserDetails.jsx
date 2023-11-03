import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge, pick } from 'lodash';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import {
  sponsorMilitaryStatusDescription,
  veteranUI,
  ssnDashesUI,
} from '../../utils/helpers';

import fullNameUI from '../../definitions/fullName';
import { validateSponsorDeathDate } from '../../validation';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
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
      militaryServiceNumber: {
        'ui:title':
          'Sponsor’s Military Service number (if they have one that’s different than their Social Security number)',
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
      ssn: {
        ...ssnDashesUI,
        'ui:title': 'Sponsor’s Social Security number',
      },
      dateOfBirth: currentOrPastDateUI('Sponsor’s date of birth'),
      placeOfBirth: {
        'ui:title': "Sponsor's place of birth (City, State, or Territory)",
      },
      militaryStatus: {
        'ui:title':
          'Sponsor’s current military status (You can add more service history information later in this application)',
        'ui:options': {
          nestedContent: {
            X: sponsorMilitaryStatusDescription,
          },
        },
      },
      isDeceased: {
        'ui:title': 'Has the sponsor died?',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            yes: 'Yes',
            no: 'No',
            unsure: 'I don’t know',
          },
        },
      },
      dateOfDeath: merge({}, currentOrPastDateUI('Sponsor’s date of death'), {
        'ui:options': {
          expandUnder: 'isDeceased',
          expandUnderCondition: 'yes',
        },
      }),
      'ui:validations': [validateSponsorDeathDate],
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
          required: ['ssn', 'militaryStatus', 'isDeceased'],
          properties: pick(veteran.properties, [
            'currentName',
            'ssn',
            'dateOfBirth',
            'militaryServiceNumber',
            'vaClaimNumber',
            'placeOfBirth',
            'militaryStatus',
            'isDeceased',
            'dateOfDeath',
          ]),
        },
      },
    },
  },
};
