import { buildAddressSchema, addressUISchema } from '../../../address-schema';
import { genericSchemas } from '../../../generic-schema';
import { TASK_KEYS } from '../../../constants';
import { isChapterFieldRequired } from '../../../helpers';
import { childInfo } from '../child-information/helpers';

const addressSchema = buildAddressSchema(false);

export const schema = {
  type: 'object',
  properties: {
    childrenToAdd: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          doesChildLiveWithYou: {
            type: 'boolean',
          },
          childAddressInfo: {
            type: 'object',
            properties: {
              personChildLivesWith: {
                type: 'object',
                properties: {
                  first: genericSchemas.genericTextInput,
                  middle: genericSchemas.genericTextInput,
                  last: genericSchemas.genericTextInput,
                },
              },
              childAddress: addressSchema,
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  childrenToAdd: {
    'ui:options': {
      itemName: 'Child',
      viewField: childInfo,
    },
    items: {
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
        childAddress: {
          ...{ 'ui:title': "Child's address" },
          ...addressUISchema(
            false,
            'childrenToAdd[INDEX].childAddressInfo.childAddress',
            (formData, index) =>
              formData.childrenToAdd[`${index}`].doesChildLiveWithYou === false,
          ),
        },
      },
    },
  },
};
