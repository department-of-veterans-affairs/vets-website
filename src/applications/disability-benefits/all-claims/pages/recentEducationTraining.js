import EducationTrainingField from '../components/EducationTrainingField';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import { validateDate } from 'platform/forms-system/src/js/validation';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { RecentEducationTrainingTitle } from '../content/recentEducationTraining';
import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';

const {
  receivedOtherEducationTrainingPostUnemployability,
  otherEducationTrainingPostUnemployability,
} = fullSchema.properties.form8940.properties.unemployability.properties;

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
    'ui:title': unemployabilityPageTitle('Recent education & training'),
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
        receivedOtherEducationTrainingPostUnemployability,
        otherEducationTrainingPostUnemployability,
      },
    },
  },
};
