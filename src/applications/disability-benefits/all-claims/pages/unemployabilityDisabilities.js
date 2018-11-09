import React from 'react';
import fullSchema from '../config/schema';
import _ from '../../../../platform/utilities/data';
import some from 'lodash/some';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import SelectArrayItemsWidget from '../components/SelectArrayItemsWidget';
import { disabilityOption } from '../content/ratedDisabilities';
import {
  DisabilitiesDescription,
  helpDescription,
  ratedDisabilitiesTitle,
  newDisabilitiesTitle,
} from '../content/unemployabilityDisabilities';

const { disabilities: disabilitiesSchema } = fullSchema.properties;
const { condition } = fullSchema.properties.newDisabilities.items.properties;

const disabilitiesRequired = msg => (errors, state, formData) => {
  const disabilitySelected = disability =>
    disability['view:unemployabilityDisability'];
  const allDisabilities = [
    ..._.get('ratedDisabilities', formData, []),
    ..._.get('newDisabilities', formData, []),
  ];
  const hasNewDisabilitiesSelected = some(allDisabilities, disabilitySelected);

  if (!hasNewDisabilitiesSelected) {
    errors.addError(msg);
  }
};

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': formData => <DisabilitiesDescription formData={formData} />,
  ratedDisabilities: {
    'ui:validations': [
      disabilitiesRequired('Please select at least one disability,'),
    ],
    'ui:title': ratedDisabilitiesTitle,
    'ui:field': 'StringField',
    'ui:widget': SelectArrayItemsWidget,
    'ui:options': {
      showFieldLabel: 'label',
      label: disabilityOption,
      selectedPropName: 'view:unemployabilityDisability',
      widgetClassNames: 'widget-outline widget-outline-group',
      keepInPageOnReview: true,
    },
  },
  newDisabilities: {
    'ui:validations': [disabilitiesRequired('')],

    'ui:title': newDisabilitiesTitle,
    'ui:field': 'StringField',
    'ui:widget': SelectArrayItemsWidget,
    'ui:options': {
      showFieldLabel: 'label',
      selectedPropName: 'view:unemployabilityDisability',
      label: disabilityOption,
      widgetClassNames: 'widget-outline',
      keepInPageOnReview: true,
    },
  },
  'view:unemployabilityHelp': {
    'ui:title': ' ',
    'ui:description': helpDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    ratedDisabilities: disabilitiesSchema,
    'view:disabilitiesClarification': {
      type: 'object',
      properties: {},
    },
    newDisabilities: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['condition'],
        properties: {
          condition,
          'view:descriptionInfo': { type: 'object', properties: {} },
        },
      },
    },
    'view:unemployabilityHelp': {
      type: 'object',
      properties: {},
    },
  },
};
