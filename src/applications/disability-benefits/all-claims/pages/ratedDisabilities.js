import fullSchema from '../config/schema';
import SelectArrayItemsWidget from '../components/SelectArrayItemsWidget';
import {
  disabilityOption,
  disabilitiesClarification
} from '../content/ratedDisabilities';

const { disabilities: disabilitiesSchema } = fullSchema.properties;

export const uiSchema = {
  'ui:title': 'Rated Disabilities',
  'ui:description':
    `Below are your rated disabilities. Please choose the disability that 
    you’re filing for an increase because the condition has gotten worse.`,
  disabilities: {
    'ui:field': 'StringField',
    'ui:widget': SelectArrayItemsWidget,
    'ui:options': {
      showFieldLabel: 'label',
      label: disabilityOption,
      widgetClassNames: 'widget-outline',
      keepInPageOnReview: true
    }
  },
  'view:disabilitiesClarification': {
    'ui:description': disabilitiesClarification
  }
};

export const schema = {
  type: 'object',
  properties: {
    disabilities: disabilitiesSchema,
    'view:disabilitiesClarification': {
      type: 'object',
      properties: {}
    }
  }
};
