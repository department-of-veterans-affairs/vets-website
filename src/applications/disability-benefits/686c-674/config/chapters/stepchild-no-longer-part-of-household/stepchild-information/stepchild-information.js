import { buildAddressSchema, addressUISchema } from '../../../address-schema';
import { TASK_KEYS } from '../../../constants';
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
          stepchildAddress: buildAddressSchema(false),
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
        ...{ 'ui:title': "Stepchild's address" },
        ...addressUISchema(
          false,
          'stepChildren[INDEX].stepchildAddress',
          formData =>
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportStepchildNotInHousehold,
            ),
        ),
      },
    },
  },
};
