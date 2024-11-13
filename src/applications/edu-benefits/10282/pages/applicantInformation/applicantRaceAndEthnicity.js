import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';

const { ethnicity } = fullSchema10282.properties;

const uiSchema = {
  ...titleUI('Your ethnicity and race'),
  ethnicity: {
    'ui:title': 'What is your ethnicity?',
    'ui:widget': 'radio',
  },
  originRace: {
    'ui:title': 'What is your race?',
    'ui:description': (
      <p className="vads-u-margin-top--0  vads-u-color--gray-medium">
        Select all that you identify with
      </p>
    ),
    'ui:webComponentField': VaCheckboxGroupField,
    isAmericanIndianOrAlaskanNative: {
      'ui:title': 'American Indian or Alaskan Native',
    },
    isAsian: {
      'ui:title': 'Asian',
    },
    isBlackOrAfricanAmerican: {
      'ui:title': 'Black or African American',
    },
    isNativeHawaiianOrOtherPacificIslander: {
      'ui:title': 'Native Hawaiian or Other Pacific Islander',
    },
    isWhite: {
      'ui:title': 'White',
    },
    noAnswer: {
      'ui:title': 'Prefer not to answer',
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    ethnicity,
    originRace: {
      type: 'object',
      properties: {
        isAmericanIndianOrAlaskanNative: {
          type: 'boolean',
        },
        isAsian: {
          type: 'boolean',
        },
        isBlackOrAfricanAmerican: {
          type: 'boolean',
        },
        isNativeHawaiianOrOtherPacificIslander: {
          type: 'boolean',
        },
        isWhite: {
          type: 'boolean',
        },
        noAnswer: {
          type: 'boolean',
        },
      },
    },
  },
};

export { uiSchema, schema };
