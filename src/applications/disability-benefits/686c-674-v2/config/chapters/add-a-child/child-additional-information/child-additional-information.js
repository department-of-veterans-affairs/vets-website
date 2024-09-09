import cloneDeep from 'platform/utilities/data/cloneDeep';
import {
  buildAddressSchema,
  addressUISchema,
  updateFormDataAddress,
} from '../../../address-schema';
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
          'ui:title': 'Person child lives with',
          first: {
            'ui:title': 'First name',
            'ui:required': (formData, index) =>
              !formData.childrenToAdd[`${index}`].doesChildLiveWithYou,
            'ui:errorMessages': {
              pattern: 'This field accepts alphabetic characters only',
            },
          },
          middle: {
            'ui:title': 'Middle name',
            'ui:options': {
              hideEmptyValueInReview: true,
            },
            'ui:errorMessages': {
              pattern: 'This field accepts alphabetic characters only',
            },
          },
          last: {
            'ui:title': 'Last name',
            'ui:required': (formData, index) =>
              !formData.childrenToAdd[`${index}`].doesChildLiveWithYou,
            'ui:errorMessages': {
              pattern: 'This field accepts alphabetic characters only',
            },
          },
          suffix: {
            'ui:options': {
              hideIf: () => true,
              hideEmptyValueInReview: true,
            },
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

export const updateFormData = (oldFormData, formData, index) =>
  updateFormDataAddress(
    oldFormData,
    formData,
    ['childrenToAdd', index, 'childAddressInfo', 'address'],
    index,
  );
