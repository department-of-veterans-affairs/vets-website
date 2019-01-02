import fullSchema from '../config/schema';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import SelectArrayItemsWidget from '../components/SelectArrayItemsWidget';
import { disabilityOption } from '../content/ratedDisabilities';
import {
  disabilitiesDescription,
  helpDescription,
} from '../content/unemployabilityDisabilities';
import { oneDisabilityRequired } from '../validations';

const { ratedDisabilities: disabilitiesSchema } = fullSchema.properties;
const { condition } = fullSchema.properties.newDisabilities.items.properties;

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': disabilitiesDescription,
  ratedDisabilities: {
    'ui:title': ' ',
    'ui:validations': [oneDisabilityRequired('rated')],
    'ui:field': 'StringField',
    'ui:widget': SelectArrayItemsWidget,
    'ui:options': {
      showFieldLabel: 'label',
      label: disabilityOption,
      selectedPropName: 'view:unemployabilityDisability',
      widgetClassNames: 'widget-outline widget-outline-group',
      keepInPageOnReview: true,
      customTitle: 'Rated disabilities',
    },
  },
  newDisabilities: {
    'ui:validations': [oneDisabilityRequired('new')],
    'ui:title': ' ',
    'ui:field': 'StringField',
    'ui:widget': SelectArrayItemsWidget,
    'ui:options': {
      showFieldLabel: 'label',
      selectedPropName: 'view:unemployabilityDisability',
      label: disabilityOption,
      widgetClassNames: 'widget-outline',
      keepInPageOnReview: true,
      customTitle: 'New unrated disabilities',
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
