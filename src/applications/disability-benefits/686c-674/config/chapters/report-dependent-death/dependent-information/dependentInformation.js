import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import DependentViewField from '../../../../components/DependentViewField';
import { genericSchemas } from '../../../generic-schema';
import { validateName } from '../../../utilities';

export const schema = {
  type: 'object',
  properties: {
    deaths: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          fullName: genericSchemas.fullName,
        },
      },
    },
  },
};

export const uiSchema = {
  deaths: {
    'ui:options': { viewField: DependentViewField },
    items: {
      fullName: {
        'ui:validations': [validateName],
        first: {
          'ui:title': 'Dependent’s first name',
          'ui:errorMessages': { required: 'Please enter a first name' },
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        },
        middle: {
          'ui:title': 'Dependent’s middle name',
        },
        last: {
          'ui:title': 'Dependent’s last name',
          'ui:errorMessages': { required: 'Please enter a last name' },
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        },
        suffix: {
          'ui:title': 'Dependent’s suffix',
          'ui:options': { widgetClassNames: 'form-select-medium' },
        },
      },
    },
  },
};
