import { genericSchemas } from '../../../generic-schema';
import { StepchildTitle } from './helpers';
import { StepchildInfo } from '../stepchildren/helpers';
import { isChapterFieldRequired } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    stepChildren: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          stillSupportingStepchild: {
            type: 'boolean',
            default: false,
          },
          stepchildLivingExpensesPaid: {
            type: 'string',
            enum: ['More than half', 'Half', 'Less than half'],
            default: 'More than half',
          },
          whoDoesTheStepchildLiveWith: {
            type: 'object',
            properties: {
              first: genericSchemas.genericTextInput,
              middle: genericSchemas.genericTextInput,
              last: genericSchemas.genericTextInput,
            },
          },
          stepchildAddress: {
            type: 'object',
            properties: {
              country: genericSchemas.countryDropdown,
              street: genericSchemas.genericTextInput,
              line2: genericSchemas.genericTextInput,
              line3: genericSchemas.genericTextInput,
              city: genericSchemas.genericTextInput,
              state: genericSchemas.genericTextInput,
              postal: genericSchemas.genericNumberAndDashInput,
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  stepChildren: {
    'ui:options': {
      itemName: 'Stepchild',
      viewField: StepchildInfo,
    },
    items: {
      'ui:title': StepchildTitle,
      stillSupportingStepchild: {
        'ui:widget': 'yesNo',
        'ui:title': 'Are you still supporting this stepchild?',
      },
      stepchildLivingExpensesPaid: {
        'ui:widget': 'radio',
        'ui:title': "How much of this stepchild's living expenses do you pay?",
        'ui:options': {
          expandUnder: 'stillSupportingStepchild',
          expandUnderCondition: true,
          keepInPageOnReview: true,
        },
      },
      whoDoesTheStepchildLiveWith: {
        'ui:title': 'Who does this stepchild live with?',
        first: {
          'ui:title': 'First Name',
          'ui:required': formData =>
            isChapterFieldRequired(formData, 'reportStepchildNotInHousehold'),
        },
        middle: {
          'ui:title': 'Middle Name',
        },
        last: {
          'ui:title': 'Last Name',
          'ui:required': formData =>
            isChapterFieldRequired(formData, 'reportStepchildNotInHousehold'),
        },
      },
      stepchildAddress: {
        'ui:title': "Stepchild's address",
        country: {
          'ui:title': 'Country',
          'ui:required': formData =>
            isChapterFieldRequired(formData, 'reportStepchildNotInHousehold'),
        },
        street: {
          'ui:title': 'Street',
          'ui:required': formData =>
            isChapterFieldRequired(formData, 'reportStepchildNotInHousehold'),
        },
        line2: {
          'ui:title': 'Line 2',
        },
        line3: {
          'ui:title': 'Line 3',
        },
        city: {
          'ui:title': 'City',
          'ui:required': formData =>
            isChapterFieldRequired(formData, 'reportStepchildNotInHousehold'),
        },
        state: {
          'ui:title': 'State',
        },
        postal: {
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
          'ui:required': formData =>
            isChapterFieldRequired(formData, 'reportStepchildNotInHousehold'),
          'ui:title': 'Postal Code',
        },
      },
    },
  },
};
