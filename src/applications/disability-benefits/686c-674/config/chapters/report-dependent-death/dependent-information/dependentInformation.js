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
          dependentType: {
            type: 'string',
            enum: ['SPOUSE', 'DEPENDENT_PARENT', 'CHILD'],
            enumNames: ['Spouse', 'Dependent Parent', 'Child'],
          },
          childStatus: {
            type: 'object',
            properties: {
              childUnder18: {
                type: 'boolean',
              },
              stepChild: {
                type: 'boolean',
              },
              adopted: {
                type: 'boolean',
              },
              disabled: {
                type: 'boolean',
              },
              childOver18InSchool: {
                type: 'boolean',
              },
            },
          },
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
      dependentType: {
        'ui:title': "What was your dependent's status?",
        'ui:widget': 'radio',
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
      },
      childStatus: {
        'ui:title': "Child's status (Check all that apply)",
        'ui:required': (formData, index) =>
          formData.deaths[`${index}`].dependentType === 'CHILD',
        'ui:options': {
          expandUnder: 'dependentType',
          expandUnderCondition: 'CHILD',
          showFieldLabel: true,
          keepInPageOnReview: true,
        },
        childUnder18: {
          'ui:title': 'Child under 18',
        },
        stepChild: {
          'ui:title': 'Stepchild',
        },
        adopted: {
          'ui:title': 'Adopted child',
        },
        disabled: {
          'ui:title': 'Child incapable of self-support',
        },
        childOver18InSchool: {
          'ui:title': 'Child 18-23 and in school',
        },
      },
    },
  },
};
