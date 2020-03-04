import { isChapterFieldRequired } from '../../../helpers';
import { genericSchemas } from '../../../generic-schema';
import { validateName } from '../../../utilities';
import SpouseViewField from '../../../../components/SpouseViewField';

const { fullName } = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    spouseWasMarriedBefore: {
      type: 'boolean',
    },
    spouseMarriageHistory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          spouseFormerPartnerName: fullName,
        },
      },
    },
  },
};

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
    },
    items: {
      spouseFormerPartnerName: {
        'ui:title': 'Former spouse’s information',
        'ui:validations': [validateName],
        first: {
          'ui:title': 'Former spouse’s first name',
          'ui:errorMessages': { required: 'Please enter a first name' },
        },
        middle: {
          'ui:title': 'Former spouse’s middle name',
        },
        last: {
          'ui:title': 'Former spouse’s last name',
          'ui:errorMessages': { required: 'Please enter a last name' },
        },
        suffix: {
          'ui:title': 'Former spouse’s suffix',
          'ui:options': { widgetClassNames: 'form-select-medium' },
        },
      },
    },
  },
};
