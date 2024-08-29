import cloneDeep from 'platform/utilities/data/cloneDeep';
import {
  buildAddressSchema,
  addressUISchema,
  updateFormDataAddress,
} from '../../../address-schema';
import { TASK_KEYS } from '../../../constants';
import { reportStepchildNotInHousehold } from '../../../utilities';
import { isChapterFieldRequired } from '../../../helpers';
import { StepchildInfo } from '../stepchildren/helpers';
import { StepchildTitle } from './helpers';

const stepchildInformationSchema = cloneDeep(
  reportStepchildNotInHousehold.properties.stepchildInformation,
);

stepchildInformationSchema.properties.stepChildren.items.properties.address = buildAddressSchema(
  true,
);

export const schema = stepchildInformationSchema;

export const uiSchema = {
  stepChildren: {
    'ui:options': {
      itemName: 'Stepchild',
      viewField: StepchildInfo,
    },
    items: {
      'ui:title': StepchildTitle,
      supportingStepchild: {
        'ui:widget': 'yesNo',
        'ui:title': 'Are you still supporting this stepchild?',
        'ui:required': formData =>
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ),
      },
      livingExpensesPaid: {
        'ui:widget': 'radio',
        'ui:title': "How much of this stepchild's living expenses do you pay?",
        'ui:options': {
          expandUnder: 'supportingStepchild',
          expandUnderCondition: true,
          keepInPageOnReview: true,
        },
        'ui:required': (formData, index) =>
          formData?.stepChildren[`${index}`]?.supportingStepchild,
      },
      whoDoesTheStepchildLiveWith: {
        'ui:title': 'Who does this stepchild live with?',
        first: {
          'ui:title': 'First name of parent or guardian',
          'ui:required': formData =>
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportStepchildNotInHousehold,
            ),
        },
        middle: {
          'ui:title': 'Middle name of parent or guardian',
          'ui:options': {
            hideEmptyValueInReview: true,
          },
        },
        last: {
          'ui:title': 'Last name of parent or guardian',
          'ui:required': formData =>
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportStepchildNotInHousehold,
            ),
        },
        suffix: {
          'ui:options': {
            hideIf: () => true,
          },
        },
      },
      address: {
        ...{ 'ui:title': "Stepchild's address" },
        ...addressUISchema(true, 'stepChildren[INDEX].address', formData =>
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ),
        ),
      },
    },
  },
};

export const updateFormData = (oldFormData, formData, index) => {
  return updateFormDataAddress(
    oldFormData,
    formData,
    ['stepChildren', index, 'address'],
    index,
  );
};
