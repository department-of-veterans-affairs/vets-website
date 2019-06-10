import EducationTrainingField from '../components/EducationTrainingField';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import { validateDate } from 'platform/forms-system/src/js/validation';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';

const {
  education,
  receivedOtherEducationTrainingPreUnemployability,
  otherEducationTrainingPreUnemployability,
} = fullSchema.properties.form8940.properties.unemployability.properties;

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
    'ui:title': unemployabilityPageTitle('Education & training'),
    education: {
      'ui:title': 'What’s the highest level of education you’ve completed?',
    },
    otherEducation: {
      'ui:title': 'Other education completed',
      'ui:options': {
        expandUnder: 'education',
        expandUnderCondition: educationChoice => educationChoice === 'Other',
      },
    },
    receivedOtherEducationTrainingPreUnemployability: {
      'ui:title':
        'Did you have any other education or training before you became too disabled to work?',
      'ui:widget': 'yesNo',
    },
    otherEducationTrainingPreUnemployability: {
      'ui:title': '',
      'ui:options': {
        viewField: EducationTrainingField,
        expandUnder: 'receivedOtherEducationTrainingPreUnemployability',
        itemName: 'Training',
      },
      items: {
        name: {
          'ui:title': 'Type of education or training',
        },
        'ui:validations': [validateDate],
        dates: {
          ...dateRangeUI(
            'From',
            'To',
            'End of education must be after start of education',
          ),
          'ui:title': 'Dates',
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        education,
        otherEducation: {
          type: 'string',
        },
        receivedOtherEducationTrainingPreUnemployability,
        otherEducationTrainingPreUnemployability,
      },
    },
  },
};
