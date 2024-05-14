import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import SelectArrayItemsWidget from '../components/SelectArrayItemsWidget';
import { disabilityOption } from '../content/ratedDisabilities';
import {
  disabilitiesDescription,
  helpDescription,
} from '../content/unemployabilityDisabilities';
import { oneDisabilityRequired } from '../validations';

const { ratedDisabilities: disabilitiesSchema } = fullSchema.definitions;
const { condition } = fullSchema.definitions.newDisabilities.items.properties;

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
      selectedPropName: 'unemployabilityDisability',
      widgetClassNames: 'widget-outline widget-outline-group',
      keepInPageOnReview: true,
      customTitle: 'Rated service-connected disabilities',
      // On the review & submit page, both this SelectArrayItemsWidget and the
      // main ratedDisabilities widget could be in edit mode causing duplicate
      // input ids/names... this appends a value on the ID to make it unique
      // so axe-coconut doesn't complain
      appendId: '2',
    },
  },
  newDisabilities: {
    'ui:validations': [oneDisabilityRequired('new')],
    'ui:title': ' ',
    'ui:field': 'StringField',
    'ui:widget': SelectArrayItemsWidget,
    'ui:options': {
      showFieldLabel: 'label',
      selectedPropName: 'unemployabilityDisability',
      label: disabilityOption,
      widgetClassNames: 'widget-outline',
      keepInPageOnReview: true,
      customTitle: 'New conditions',
      appendId: '2',
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
