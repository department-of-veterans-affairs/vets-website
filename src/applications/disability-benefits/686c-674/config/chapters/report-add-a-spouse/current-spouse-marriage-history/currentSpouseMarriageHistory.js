import { isChapterFieldRequired } from '../../../helpers';
import { validateName, addSpouse } from '../../../utilities';
import SpouseViewField from '../../../../components/SpouseViewField';

export const schema = addSpouse.properties.spouseMarriageHistory;

export const uiSchema = {
  spouseWasMarriedBefore: {
    'ui:title': 'Was your spouse married before?',
    'ui:widget': 'yesNo',
    'ui:required': formData => isChapterFieldRequired(formData, 'addSpouse'),
  },
  spouseMarriageHistory: {
    'ui:options': {
      viewField: SpouseViewField,
      expandUnder: 'spouseWasMarriedBefore',
      expandUnderCondition: true,
      keepInPageOnReview: true,
      itemName: 'former spouse',
      // ui:required doesn't play well with expandUnder, possibly because the markup isn't added to the dom until the expandUnder condition is met.
      // Because of this, a user can progress past the below fields, even if they're technically mandatory.
      // Using updateSchema and ensuring at least one item needs to be in the array causes the validations to fire properly.
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
          'ui:required': formData => formData.spouseWasMarriedBefore,
        },
        middle: {
          'ui:title': 'Former spouse’s middle name',
        },
        last: {
          'ui:title': 'Former spouse’s last name',
          'ui:errorMessages': { required: 'Please enter a last name' },
          'ui:required': formData => formData.spouseWasMarriedBefore,
        },
        suffix: {
          'ui:title': 'Former spouse’s suffix',
          'ui:options': { widgetClassNames: 'form-select-medium' },
        },
      },
    },
  },
};
