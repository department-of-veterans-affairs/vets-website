import cloneDeep from 'platform/utilities/data/cloneDeep';
import { buildAddressSchema, addressUISchema } from '../../../address-schema';
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
      },
      livingExpensesPaid: {
        'ui:widget': 'radio',
        'ui:title': "How much of this stepchild's living expenses do you pay?",
        'ui:options': {
          expandUnder: 'supportingStepchild',
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
