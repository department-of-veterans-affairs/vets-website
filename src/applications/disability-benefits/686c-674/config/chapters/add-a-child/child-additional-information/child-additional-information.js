import { genericSchemas } from '../../../generic-schema';
import { isChapterFieldRequired } from '../../../helpers';
import { childInfo } from '../child-information/helpers';

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
            default: true,
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
              childAddress: {
                type: 'object',
                properties: {
                  country: genericSchemas.genericTextInput,
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
            'ui:required': formData =>
              isChapterFieldRequired(formData, 'addChild'),
          },
          middle: {
            'ui:title': 'Middle name',
          },
          last: {
            'ui:title': 'Last name',
            'ui:required': formData =>
              isChapterFieldRequired(formData, 'addChild'),
          },
        },
        childAddress: {
          'ui:title': "Child's address",
          country: {
            'ui:title': 'Country',
            'ui:required': formData =>
              isChapterFieldRequired(formData, 'addChild'),
          },
          street: {
            'ui:title': 'Street',
            'ui:required': formData =>
              isChapterFieldRequired(formData, 'addChild'),
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
              isChapterFieldRequired(formData, 'addChild'),
          },
          state: {
            'ui:title': 'State or county',
          },
          postal: {
            'ui:options': {
              widgetClassNames: 'usa-input-medium',
            },
            'ui:required': formData =>
              isChapterFieldRequired(formData, 'addChild'),
            'ui:title': 'Postal Code',
          },
        },
      },
    },
  },
};
