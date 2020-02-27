import { genericSchemas } from '../../../generic-schema';
import { stepchildTitle } from './helpers';
import { isChapterFieldRequired } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    stepChildren: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          stillSupportingStepchild: {
            type: 'boolean',
            default: true,
          },
          stepchildLivingExpensesPaid: {
            type: 'string',
            enum: ['More than half', 'Half', 'Less than half'],
            default: 'More than half',
          },
          whoDoesTheStepchildLiveWith: {
            type: 'object',
            properties: {
              first: genericSchemas.genericTextinput,
              middle: genericSchemas.genericTextinput,
              last: genericSchemas.genericTextinput,
            },
          },
          stepchildAddress: {
            type: 'object',
            properties: {
              country: genericSchemas.countryDropdown,
              street: genericSchemas.genericTextinput,
              line2: genericSchemas.genericTextinput,
              line3: genericSchemas.genericTextinput,
              city: genericSchemas.genericTextinput,
              state: genericSchemas.genericTextinput,
              postal: genericSchemas.genericNumberInput,
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  stepChildren: {
    items: {
      'ui:title': stepchildTitle,
      stillSupportingStepchild: {
        'ui:widget': 'yesNo',
        'ui:title': 'Are you still supporting this stepchild?',
      },
      stepchildLivingExpensesPaid: {
        'ui:widget': 'radio',
        'ui:title': "How much of this stepchild's living expenses do you pay?",
      },
      whoDoesTheStepchildLiveWith: {
        'ui:title': 'Who does this stepchild live with?',
        first: {
          'ui:title': 'First Name',
          'ui:required': formData =>
            isChapterFieldRequired(
              formData,
              'reportStepchildNotInHousehold',
            ),
        },
        middle: {
          'ui:title': 'Middle Name',
        },
        last: {
          'ui:title': 'Last Name',
          'ui:required': formData =>
            isChapterFieldRequired(
              formData,
              'reportStepchildNotInHousehold',
            ),
        },
      },
      stepchildAddress: {
        'ui:title': "Stepchild's address",
        country: {
          'ui:title': 'Country',
          'ui:required': formData =>
            isChapterFieldRequired(
              formData,
              'reportStepchildNotInHousehold',
            ),
        },
        street: {
          'ui:title': 'Street',
          'ui:required': formData =>
            isChapterFieldRequired(
              formData,
              'reportStepchildNotInHousehold',
            ),
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
            isChapterFieldRequired(
              formData,
              'reportStepchildNotInHousehold',
            ),
        },
        state: {
          'ui:title': 'State',
          'ui:required': formData =>
            isChapterFieldRequired(
              formData,
              'reportStepchildNotInHousehold',
            ),
        },
        postal: {
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
          'ui:required': formData =>
            isChapterFieldRequired(
              formData,
              'reportStepchildNotInHousehold',
            ),
          'ui:title': 'Postal Code',
        },
      },
    },
  },
};
