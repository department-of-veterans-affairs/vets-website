import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';
import {
  currentOrPastDateUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';

import fullNameUI from 'platform/forms/definitions/fullName';
import {
  veteranUI,
  sponsorDetailsSubHeader,
  sponsorDetailsSsnDashesUI,
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
          'ui:webComponentField': VaTextInputField,
        },
        last: {
          'ui:title': 'Sponsor’s last name',
          'ui:webComponentField': VaTextInputField,
        },
        middle: {
          'ui:title': 'Sponsor’s middle name',
          'ui:webComponentField': VaTextInputField,
        },
        suffix: {
          'ui:title': 'Sponsor’s suffix',
          'ui:webComponentField': VaSelectField,
          'ui:options': { classNames: 'form-select-medium' },
        },
        maiden: {
          'ui:title': 'Sponsor’s maiden name',
          'ui:webComponentField': VaTextInputField,
        },
        'ui:order': ['first', 'middle', 'last', 'suffix', 'maiden'],
      }),
      ssn: sponsorDetailsSsnDashesUI,
      dateOfBirth: currentOrPastDateUI('Sponsor’s date of birth'),
      cityOfBirth: {
        'ui:title': 'Sponsor’s birth city',
        'ui:webComponentField': VaTextInputField,
      },
      stateOfBirth: {
        'ui:title': 'Sponsor’s birth state',
        'ui:webComponentField': VaTextInputField,
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
          properties: merge(
            {},
            {
              'view:sponsorDetailsDescription': {
                type: 'object',
                properties: {},
              },
            },
            pick(veteran.properties, ['currentName']),
            {
              ssn: ssnSchema,
            },
            pick(veteran.properties, [
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
