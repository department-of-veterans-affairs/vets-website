import cloneDeep from 'platform/utilities/data/cloneDeep';
import { buildAddressSchema, addressUISchema } from '../../../address-schema';
import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import { addChild } from '../../../utilities';
import { ChildNameHeader } from '../helpers';
import { childInfo } from '../child-information/helpers';

const addressSchema = buildAddressSchema(true);

const additionalInformationSchema = cloneDeep(
  addChild.properties.addChildAdditionalInformation,
);

additionalInformationSchema.properties.childrenToAdd.items.properties.childAddressInfo.properties.address = addressSchema;

export const schema = additionalInformationSchema;

export const uiSchema = {
  childrenToAdd: {
    'ui:options': {
      itemName: 'Child',
      viewField: childInfo,
    },
    items: {
      'ui:title': ChildNameHeader,
      doesChildLiveWithYou: {
        'ui:widget': 'yesNo',
        'ui:title': 'Does this child live with you?',
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addChild),
      },
      childAddressInfo: {
        'ui:options': {
          expandUnder: 'doesChildLiveWithYou',
          expandUnderCondition: false,
          keepInPageOnReview: true,
        },
        personChildLivesWith: {
          'ui:title': 'Person your child lives with',
          first: {
            'ui:title': 'First name',
            'ui:required': (formData, index) =>
              !formData.childrenToAdd[`${index}`].doesChildLiveWithYou,
          },
          middle: {
            'ui:title': 'Middle name',
          },
          last: {
            'ui:title': 'Last name',
            'ui:required': (formData, index) =>
              !formData.childrenToAdd[`${index}`].doesChildLiveWithYou,
          },
        },
        address: {
          ...{ 'ui:title': "Child's address" },
          ...addressUISchema(
            true,
            'childrenToAdd[INDEX].childAddressInfo.address',
            (formData, index) =>
              formData.childrenToAdd[`${index}`].doesChildLiveWithYou === false,
          ),
        },
      },
    },
  },
};
