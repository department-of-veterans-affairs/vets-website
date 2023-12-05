import get from '@department-of-veterans-affairs/platform-forms-system/get';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import {
  fullNameUI,
  fullNameSchema,
  currentOrPastDateUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import { contactWarning, contactWarningMulti } from '../helpers';

import SpouseMarriageView from '../components/SpouseMarriageView';
import SpouseMarriageTitle from '../components/SpouseMarriageTitle';

import { validateAfterMarriageDate } from '../validation';

const { marriages } = fullSchemaPensions.definitions;

const marriageProperties = marriages.items.properties;

const reasonForSeparation = {
  ...marriageProperties.reasonForSeparation,
  enum: ['Death', 'Divorce', 'Other'],
};

const hasMultipleMarriages = form =>
  get(['spouseMarriages', 'length'], form) > 1;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': SpouseMarriageTitle,
    'view:contactWarning': {
      'ui:description': contactWarning,
      'ui:options': {
        hideIf: form => hasMultipleMarriages(form),
      },
    },
    'view:contactWarningMulti': {
      'ui:description': contactWarningMulti,
      'ui:options': {
        hideIf: form => !hasMultipleMarriages(form),
      },
    },
    spouseMarriages: {
      'ui:options': {
        itemName: 'former marriage of the spouse',
        viewField: SpouseMarriageView,
        reviewTitle: 'Spouse’s former marriages',
      },
      items: {
        spouseFullName: fullNameUI(title => `Former spouse’s ${title}`),
        reasonForSeparation: {
          'ui:title': 'How did the marriage end?',
          'ui:widget': 'radio',
        },
        otherExplanation: {
          'ui:title': 'Please specify',
          'ui:options': {
            hideLabelText: true,
            expandUnder: 'reasonForSeparation',
            expandUnderCondition: 'Other',
          },
          'ui:required': (form, index) =>
            get(['spouseMarriages', index, 'reasonForSeparation'], form) ===
            'Other',
        },
        dateOfMarriage: currentOrPastDateUI('Date of marriage'),
        dateOfSeparation: {
          ...currentOrPastDateUI('Date marriage ended'),
          'ui:validations': [validateAfterMarriageDate],
        },
        locationOfMarriage: {
          'ui:title': 'Place of marriage (city and state or foreign country)',
        },
      },
    },
    'view:contactWarningI': {
      'ui:description': contactWarning,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:contactWarning': { type: 'object', properties: {} },
      'view:contactWarningMulti': { type: 'object', properties: {} },
      spouseMarriages: {
        type: 'array',
        items: {
          type: 'object',
          required: [
            'spouseFullName',
            'reasonForSeparation',
            'dateOfMarriage',
            'dateOfSeparation',
            'locationOfMarriage',
          ],
          properties: {
            spouseFullName: fullNameSchema,
            reasonForSeparation,
            otherExplanation: marriageProperties.otherExplanation,
            dateOfMarriage: marriageProperties.dateOfMarriage,
            dateOfSeparation: marriageProperties.dateOfSeparation,
            locationOfMarriage: marriageProperties.locationOfMarriage,
          },
        },
      },
    },
  },
};
