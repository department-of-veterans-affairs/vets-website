import React from 'react';
import fullSchema from '../config/schema';
import SelectArrayItemsWidget from '../components/SelectArrayItemsWidget';
import { disabilityOption } from '../content/ratedDisabilities';

export const uiSchema = {
  'ui:title': 'TITLE',
  'ui:description': `Below are your rated disabilities. If you’ll be filing for increased 
    compensation because one of them has gotten worse, please choose the 
    disability here.`,

  ratedDisabilities: {
    'ui:title': ' ',
    'ui:field': 'StringField',
    'ui:widget': SelectArrayItemsWidget,
  },
  newDisabilities: {
    'ui:title': ' ',
    'ui:field': 'StringField',
    'ui:widget': SelectArrayItemsWidget,
  },
  'ui:options': {
    showFieldLabel: 'label',
    label: disabilityOption,
    widgetClassNames: 'widget-outline',
    keepInPageOnReview: true,
    selectedPropName: 'view:unemployabilityDisability',
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:allDisabilities': {
      type: 'object',
      properties: {
        ratedDisabilities: disabilitiesSchema,
      },
    },
    // newDisabilities: disabilitiesSchema,
  },
};
