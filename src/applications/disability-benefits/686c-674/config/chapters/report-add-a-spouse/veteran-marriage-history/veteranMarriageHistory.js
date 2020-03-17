import { isChapterFieldRequired } from '../../../helpers';
import { genericSchemas } from '../../../generic-schema';
import { validateName } from '../../../utilities';
import { SpouseItemHeader } from './helpers';
import SpouseViewField from '../../../../components/SpouseViewField';

const { fullName } = genericSchemas;

export const schema = {
  type: 'object',
  properties: {
    veteranWasMarriedBefore: {
      type: 'boolean',
    },
    veteranMarriageHistory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          formerSpouseName: fullName,
        },
      },
    },
  },
};

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
      updateSchema: () => ({
        minItems: 1,
      }),
    },
    items: {
      'ui:title': SpouseItemHeader,
      formerSpouseName: {
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
