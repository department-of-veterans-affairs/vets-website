import _ from '../../../../platform/utilities/data';
import fullSchema from '../config/schema';

const { isHomeless, isAtRisk } = fullSchema.properties;

export const uiSchema = {
  isHomeless: {
    'ui:title': 'Are you currently homeless?',
    'ui:widget': 'yesNo',
  },
  isAtRisk: {
    'ui:title': 'Are you currently at risk of becoming homeless?',
    'ui:widget': 'yesNo',
    'ui:options': {
      expandUnder: 'isHomeless',
      expandUnderCondition: false
    },
    'ui:required': (formData) => !_.get('isHomeless', formData)
  }
};

export const schema = {
  type: 'object',
  required: ['isHomeless'],
  properties: {
    isHomeless,
    isAtRisk
  }
};
