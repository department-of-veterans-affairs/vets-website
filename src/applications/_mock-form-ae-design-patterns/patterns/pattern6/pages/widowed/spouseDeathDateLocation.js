import React from 'react';
import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import constants from 'vets-json-schema/dist/constants.json';

// Get military states to filter them out
const MILITARY_STATE_VALUES = constants.militaryStates.map(
  state => state.value,
);

// Get states from the same source as the addressUI component
const filteredStates = constants.states.USA.filter(
  state => !MILITARY_STATE_VALUES.includes(state.value),
);
const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_NAMES = filteredStates.map(state => state.label);

// Get countries from the same source as the addressUI component
const COUNTRY_VALUES = constants.countries
  .filter(country => country.value !== 'USA')
  .map(country => country.value);
const COUNTRY_NAMES = constants.countries
  .filter(country => country.value !== 'USA')
  .map(country => country.label);

const AdditionalInformation = (
  <va-additional-info
    trigger="Why we ask for this information"
    class="vads-u-margin-top--2 vads-u-margin-bottom--3"
    uswds
  >
    <div>
      <p className="vads-u-margin-top--0">
        [Language should be specific to the form and explain why VA needs to
        know the date and place of their spouse’s death.]
      </p>
    </div>
  </va-additional-info>
);

export default {
  title: "Place and date of spouse's death",
  path: 'spouse-death-information',
  uiSchema: {
    ...titleUI('When and where did your spouse die?'),
    'view:additionalInformation': {
      'ui:description': AdditionalInformation,
    },
    dateOfDeath: currentOrPastDateUI('Date'),
    'view:diedOutsideUS': {
      'ui:title': 'My spouse died outside the U.S.',
      'ui:webComponentField': VaCheckboxField,
    },
    city: {
      'ui:title': 'City',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Please enter the city where you got married',
      },
    },
    state: {
      'ui:title': 'State',
      'ui:webComponentField': VaSelectField,
      'ui:required': formData => !formData['view:diedOutsideUS'],
      'ui:options': {
        hideIf: formData => formData['view:diedOutsideUS'],
      },
      'ui:errorMessages': {
        required: 'Please select a state',
      },
    },
    country: {
      'ui:title': 'Country',
      'ui:webComponentField': VaSelectField,
      'ui:required': formData => formData['view:diedOutsideUS'],
      'ui:errorMessages': {
        required: 'Please select a country',
      },
      'ui:options': {
        updateSchema: formData => {
          if (formData['view:diedOutsideUS']) {
            return {
              'ui:hidden': false,
            };
          }
          return {
            'ui:hidden': true,
          };
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['dateOfDeath', 'city', 'state'],
    properties: {
      'view:additionalInformation': {
        type: 'object',
        properties: {},
      },
      dateOfDeath: currentOrPastDateSchema,
      'view:diedOutsideUS': {
        type: 'boolean',
      },
      city: {
        type: 'string',
      },
      state: {
        type: 'string',
        enum: STATE_VALUES,
        enumNames: STATE_NAMES,
      },
      country: {
        type: 'string',
        enum: COUNTRY_VALUES,
        enumNames: COUNTRY_NAMES,
      },
    },
  },
};
