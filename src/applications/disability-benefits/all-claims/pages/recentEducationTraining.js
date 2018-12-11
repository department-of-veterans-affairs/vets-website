import EducationTrainingField from '../components/EducationTrainingField';
import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import { validateDate } from 'us-forms-system/lib/js/validation';
import fullSchema from '../config/schema';
import { RecentEducationTrainingTitle } from '../content/recentEducationTraining';

const { dateRange } = fullSchema.definitions;

export const uiSchema = {
  'ui:title': 'Recent Education & training',
  unemployability: {
    receivedOtherEducationTrainingPostUnemployability: {
      'ui:title': RecentEducationTrainingTitle,
      'ui:widget': 'yesNo',
    },
    otherEducationTrainingPostUnemployability: {
      'ui:title': '',
      'ui:options': {
        viewField: EducationTrainingField,
        expandUnder: 'receivedOtherEducationTrainingPostUnemployability',
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
        receivedOtherEducationTrainingPostUnemployability: {
          type: 'boolean',
        },
        otherEducationTrainingPostUnemployability: {
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
