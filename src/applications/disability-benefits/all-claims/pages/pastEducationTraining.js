import EducationTrainingField from '../components/EducationTrainingField';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import { validateDate } from 'us-forms-system/lib/js/validation';
import fullSchema from '../config/schema';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

const { dateRange } = fullSchema.definitions;

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
    'ui:title': 'Education & training',
    education: {
      'ui:title': 'What’s the highest level of education you’ve completed?',
    },
    otherEducation: {
      'ui:title': 'Other education completed',
      'ui:options': {
        expandUnder: 'education',
        expandUnderCondition: education => education === 'Other',
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
            'Beginning',
            'Completion',
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
        education: {
          type: 'string',
          enum: [
            'Some elementary school',
            'Some high school',
            'High school diploma or GED',
            'Some college',
            "Associate's degree",
            'Bachelor’s degree',
            'Master’s degree',
            'Doctoral degre',
            'Other',
          ],
        },
        otherEducation: {
          type: 'string',
        },
        receivedOtherEducationTrainingPreUnemployability: {
          type: 'boolean',
        },
        otherEducationTrainingPreUnemployability: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              dates: dateRange,
            },
          },
        },
      },
    },
  },
};
