import fullSchema from '../config/schema';
import SelectArrayItemsWidget from '../components/SelectArrayItemsWidget';
import {
  disabilityOption,
  disabilitiesClarification,
} from '../content/ratedDisabilities';

const { disabilities: disabilitiesSchema } = fullSchema.properties;

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
      widgetClassNames: 'widget-outline',
      keepInPageOnReview: true,
    },
  },
  'view:disabilitiesClarification': {
    'ui:description': disabilitiesClarification,
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
  },
};
