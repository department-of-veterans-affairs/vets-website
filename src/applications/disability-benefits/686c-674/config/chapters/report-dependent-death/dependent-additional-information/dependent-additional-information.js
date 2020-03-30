import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import DependentViewField from '../../../../components/DependentViewField';
import { genericSchemas } from '../../../generic-schema';

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
        childUnder18: {
          'ui:title': 'Child under 18',
        },
        stepChild: {
          'ui:title': 'Stepchild',
        },
        adopted: {
          'ui:title': 'Adopted',
        },
        disabled: {
          'ui:title': 'Disabled',
        },
        childOver18InSchool: {
          'ui:title': 'Child over 18 in school',
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
