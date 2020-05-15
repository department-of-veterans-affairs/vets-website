import SpouseViewField from '../../../../components/SpouseViewField';
import { isChapterFieldRequired } from '../../../helpers';
import { validateName, addSpouse } from '../../../utilities';

export const schema = addSpouse.properties.veteranMarriageHistory;

export const uiSchema = {
  veteranWasMarriedBefore: {
    'ui:title': 'Were you married before?',
    'ui:widget': 'yesNo',
    'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
  },
  veteranMarriageHistory: {
    'ui:options': {
      viewField: SpouseViewField,
      expandUnder: 'veteranWasMarriedBefore',
      expandUnderCondition: true,
      keepInPageOnReview: true,
      itemName: 'former spouse',
      updateSchema: () => ({
        minItems: 1,
      }),
    },
    items: {
      fullName: {
        'ui:validations': [validateName],
        first: {
          'ui:title': 'Former spouse’s first name',
          'ui:errorMessages': { required: 'Please enter a first name' },
          'ui:required': formData => formData.veteranWasMarriedBefore,
        },
        middle: {
          'ui:title': 'Former spouse’s middle name',
        },
        last: {
          'ui:title': 'Former spouse’s last name',
          'ui:errorMessages': { required: 'Please enter a last name' },
          'ui:required': formData => formData.veteranWasMarriedBefore,
        },
        suffix: {
          'ui:title': 'Former spouse’s suffix',
          'ui:options': { widgetClassNames: 'form-select-medium' },
        },
      },
    },
  },
};
