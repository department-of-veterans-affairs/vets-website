import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
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
          dependentType: {
            type: 'string',
            enum: ['SPOUSE', 'DEPENDENT_PARENT', 'CHILD'],
            enumNames: ['Spouse', 'Dependent Parent', 'Child'],
          },
          childStatus: {
            type: 'string',
            enum: [
              'Child Under 18',
              'Stepchild',
              'Adopted',
              'Child Incapable of self-support',
              'Child 18-23 and in school',
            ],
          },
          fullName: genericSchemas.fullName,
          deceasedDateOfDeath: genericSchemas.date,
          deceasedLocationOfDeath: genericSchemas.genericLocation,
        },
      },
    },
  },
};

export const uiSchema = {
  deaths: {
    'ui:options': { viewField: DependentViewField },
    items: {
      dependentType: {
        'ui:title': "What was your dependent's status?",
        'ui:widget': 'radio',
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
        'ui:widget': 'radio',
      },
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
      deceasedDateOfDeath: currentOrPastDateUI('Dependent’s date of death'),
      deceasedLocationOfDeath: {
        'ui:title': 'Place of death',
        city: {
          'ui:title': 'City (or APO/FPO/DPO)',
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        },
        state: {
          'ui:title': 'State (or Country if outside the USA)',
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.reportDeath),
        },
      },
    },
  },
};
