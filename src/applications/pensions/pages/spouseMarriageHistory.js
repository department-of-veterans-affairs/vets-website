import merge from 'lodash/merge';
import get from '@department-of-veterans-affairs/platform-forms-system/get';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import currentOrPastDateUI from '@department-of-veterans-affairs/platform-forms-system/currentOrPastDate';
import fullNameUI from '@department-of-veterans-affairs/platform-forms-system/fullName';

import { marriageWarning, createSpouseLabelSelector } from '../helpers';

import SpouseMarriageTitle from '../components/SpouseMarriageTitle';

import { validateAfterMarriageDate } from '../validation';

const { marriages } = fullSchemaPensions.definitions;

const marriageProperties = marriages.items.properties;

const marriageType = {
  ...marriageProperties.marriageType,
  enum: ['Ceremonial', 'Common-law', 'Proxy', 'Tribal', 'Other'],
};

const reasonForSeparation = {
  ...marriageProperties.reasonForSeparation,
  enum: ['Widowed', 'Divorced'],
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    spouseMarriages: {
      items: {
        'ui:title': SpouseMarriageTitle,
        spouseFullName: merge({}, fullNameUI, {
          first: {
            'ui:title': 'Their spouse’s first name',
          },
          last: {
            'ui:title': 'Their spouse’s last name',
          },
          middle: {
            'ui:title': 'Their spouse’s middle name',
          },
          suffix: {
            'ui:title': 'Their spouse’s suffix',
          },
        }),
        dateOfMarriage: merge({}, currentOrPastDateUI(''), {
          'ui:options': {
            updateSchema: createSpouseLabelSelector(
              spouseName =>
                `Date of ${spouseName.first} ${spouseName.last}’s marriage`,
            ),
          },
        }),
        locationOfMarriage: {
          'ui:options': {
            updateSchema: createSpouseLabelSelector(
              spouseName =>
                `Place of ${spouseName.first} ${
                  spouseName.last
                }’s marriage (city and state or foreign country)`,
            ),
          },
        },
        marriageType: {
          'ui:title': 'Type of marriage',
          'ui:widget': 'radio',
        },
        otherExplanation: {
          'ui:title': 'Please specify',
          'ui:required': (form, index) =>
            get(['spouseMarriages', index, 'marriageType'], form) === 'Other',
          'ui:options': {
            expandUnder: 'marriageType',
            expandUnderCondition: 'Other',
          },
        },
        'view:marriageWarning': {
          'ui:description': marriageWarning,
          'ui:options': {
            hideIf: (form, index) =>
              get(['spouseMarriages', index, 'marriageType'], form) !==
              'Common-law',
          },
        },
        reasonForSeparation: {
          'ui:title': 'Why did the marriage end?',
          'ui:widget': 'radio',
        },
        dateOfSeparation: {
          ...currentOrPastDateUI('Date marriage ended'),
          'ui:validations': [validateAfterMarriageDate],
        },

        locationOfSeparation: {
          'ui:title':
            'Place marriage ended (city and state or foreign country)',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      spouseMarriages: {
        type: 'array',
        items: {
          type: 'object',
          required: [
            'spouseFullName',
            'dateOfMarriage',
            'marriageType',
            'locationOfMarriage',
            'reasonForSeparation',
            'dateOfSeparation',
            'locationOfSeparation',
          ],
          properties: {
            dateOfMarriage: marriageProperties.dateOfMarriage,
            locationOfMarriage: marriageProperties.locationOfMarriage,
            spouseFullName: marriageProperties.spouseFullName,
            marriageType,
            otherExplanation: marriageProperties.otherExplanation,
            'view:marriageWarning': { type: 'object', properties: {} },
            reasonForSeparation,
            dateOfSeparation: marriageProperties.dateOfSeparation,
            locationOfSeparation: marriageProperties.locationOfSeparation,
          },
        },
      },
    },
  },
};
