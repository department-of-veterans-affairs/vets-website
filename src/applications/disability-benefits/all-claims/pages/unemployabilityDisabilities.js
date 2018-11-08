import fullSchema from '../config/schema';
import SelectArrayItemsWidget from '../components/SelectArrayItemsWidget';
import { disabilityOption } from '../content/ratedDisabilities';

const { disabilities: disabilitiesSchema } = fullSchema.properties;
const { condition } = fullSchema.properties.newDisabilities.items.properties;

export const uiSchema = {
  'ui:title': 'Rated Disabilities',
  'ui:description': `Below are your rated disabilities. If you’ll be filing for increased 
    compensation because one of them has gotten worse, please choose the 
    disability here.`,
  ratedDisabilities: {
    'ui:title': ' ',
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
    'ui:title': ' ',
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
  },
};
