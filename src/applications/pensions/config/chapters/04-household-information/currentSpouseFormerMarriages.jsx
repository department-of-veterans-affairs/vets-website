import React from 'react';
import PropTypes from 'prop-types';
import get from 'platform/utilities/data/get';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import {
  currentOrPastDateUI,
  fullNameUI,
  fullNameSchema,
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  ContactWarningAlert,
  ContactWarningMultiAlert,
} from '../../../components/FormAlerts';
import { formatFullName } from '../../../helpers';
import ListItemView from '../../../components/ListItemView';
import SpouseMarriageTitle from '../../../components/SpouseMarriageTitle';
import { separationTypeLabels } from '../../../labels';

import {
  validateAfterMarriageDates,
  validateUniqueMarriageDates,
} from '../../../validation';

const { marriages } = fullSchemaPensions.definitions;

const marriageProperties = marriages.items.properties;

const hasMultipleMarriages = form => {
  const spouseMarriagesLength = get(['spouseMarriages', 'length'], form)
    ? get(['spouseMarriages', 'length'], form)
    : 0;
  return spouseMarriagesLength > 1;
};

export const otherExplanationRequired = (form, index) =>
  get(['spouseMarriages', index, 'reasonForSeparation'], form) === 'OTHER';

const SpouseMarriageView = ({ formData }) => (
  <ListItemView title={formatFullName(formData.spouseFullName)} />
);

SpouseMarriageView.propTypes = {
  formData: PropTypes.object,
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(SpouseMarriageTitle),
    'view:contactWarning': {
      'ui:description': ContactWarningAlert,
      'ui:options': {
        hideIf: form => hasMultipleMarriages(form),
      },
    },
    'view:contactWarningMulti': {
      'ui:description': ContactWarningMultiAlert,
      'ui:options': {
        hideIf: form => !hasMultipleMarriages(form),
      },
    },
    spouseMarriages: {
      'ui:options': {
        itemName: 'Former marriage of the spouse',
        itemAriaLabel: data =>
          data.spouseFullName &&
          `${formatFullName(data.spouseFullName)} former marriage of spouse`,
        viewField: SpouseMarriageView,
        reviewTitle: 'Spouse’s former marriages',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
      },
      items: {
        spouseFullName: fullNameUI(title => `Former spouse’s ${title}`),
        reasonForSeparation: radioUI({
          title: 'How did the marriage end?',
          labels: separationTypeLabels,
          classNames: 'vads-u-margin-bottom--2',
        }),
        otherExplanation: {
          'ui:title': 'Please specify',
          'ui:options': {
            expandUnder: 'reasonForSeparation',
            expandUnderCondition: 'OTHER',
          },
          'ui:required': otherExplanationRequired,
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
  },
  schema: {
    type: 'object',
    properties: {
      'view:contactWarning': { type: 'object', properties: {} },
      'view:contactWarningMulti': { type: 'object', properties: {} },
      spouseMarriages: {
        type: 'array',
        minItems: 1,
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
            reasonForSeparation: radioSchema(Object.keys(separationTypeLabels)),
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
