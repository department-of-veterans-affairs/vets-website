import _ from 'lodash/fp';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms/definitions/fullName';
import { genericSchemas } from '../../../generic-schema';
import DependentViewField from '../../../../components/DependentViewField';

const dependentTypeSchema = {
  type: 'string',
  enum: ['SPOUSE', 'DEPENDENT_PARENT', 'CHILD'],
  enumNames: ['Spouse', 'Dependent Parent', 'Child'],
};

const dependentTypeUiSchema = {
  'ui:title': "What was your dependent's status?",
  'ui:widget': 'radio',
};

const childStatusSchema = {
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
};

const childStatusUiSchema = {
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
};

const deathLocationUiSchema = {
  'ui:title': 'Place of death',
  city: {
    'ui:title': 'City (or APO/FPO/DPO)',
  },
  state: {
    'ui:title': 'State (or Country if outside the USA)',
  },
};

export const schema = {
  type: 'object',
  properties: {
    deaths: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: [
          'dependentType',
          'fullName',
          'deceasedDateOfDeath',
          'deceasedLocationOfDeath',
        ],
        properties: {
          dependentType: dependentTypeSchema,
          childStatus: childStatusSchema,
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
      dependentType: dependentTypeUiSchema,
      childStatus: childStatusUiSchema,
      fullName: _.merge(fullNameUI, {
        first: {
          'ui:title': 'Dependent’s first name',
        },
        middle: {
          'ui:title': 'Dependent’s middle name',
        },
        last: {
          'ui:title': 'Dependent’s last name',
        },
      }),
      deceasedDateOfDeath: currentOrPastDateUI('Dependent’s date of death'),
      deceasedLocationOfDeath: deathLocationUiSchema,
    },
  },
};
