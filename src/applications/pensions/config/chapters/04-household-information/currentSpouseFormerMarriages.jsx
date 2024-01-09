import React from 'react';
import PropTypes from 'prop-types';
import get from 'platform/utilities/data/get';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import {
  fullNameUI,
  fullNameSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { contactWarning, contactWarningMulti } from '../../../helpers';

import ListItemView from '../../../components/ListItemView';
import SpouseMarriageTitle from '../../../components/SpouseMarriageTitle';

import {
  validateAfterMarriageDates,
  validateUniqueMarriageDates,
} from '../../../validation';

const { marriages } = fullSchemaPensions.definitions;

const marriageProperties = marriages.items.properties;

const hasMultipleMarriages = form =>
  get(['spouseMarriages', 'length'], form) > 1;

const SpouseMarriageView = ({ formData }) => (
  <ListItemView
    title={`${formData.spouseFullName.first} ${formData.spouseFullName.last}`}
  />
);

SpouseMarriageView.propTypes = {
  formData: PropTypes.object,
};

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
            expandUnder: 'reasonForSeparation',
            expandUnderCondition: 'Other',
          },
          'ui:required': (form, index) =>
            get(['spouseMarriages', index, 'reasonForSeparation'], form) ===
            'Other',
        },
        dateOfMarriage: {
          ...currentOrPastDateUI('Date of marriage'),
          'ui:validations': [validateUniqueMarriageDates],
        },
        dateOfSeparation: {
          ...currentOrPastDateUI('Date marriage ended'),
          'ui:validations': [validateAfterMarriageDates],
        },
        locationOfMarriage: {
          'ui:title': 'Place of marriage (city and state or foreign country)',
        },
        locationOfSeparation: {
          'ui:title':
            'Place of marriage termination (city and state or foreign country)',
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
            'locationOfSeparation',
          ],
          properties: {
            spouseFullName: fullNameSchema,
            reasonForSeparation: {
              type: 'string',
              enum: ['Death', 'Divorce', 'Other'],
            },
            otherExplanation: marriageProperties.otherExplanation,
            dateOfMarriage: marriageProperties.dateOfMarriage,
            dateOfSeparation: marriageProperties.dateOfSeparation,
            locationOfMarriage: marriageProperties.locationOfMarriage,
            locationOfSeparation: { type: 'string' },
          },
        },
      },
    },
  },
};
