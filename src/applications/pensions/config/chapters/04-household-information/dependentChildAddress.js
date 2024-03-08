import merge from 'lodash/merge';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import {
  addressUI,
  addressSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';

/** @type {PageSchema} */
export default {
  uiSchema: {
    dependents: {
      items: {
        ...titleUI(createHouseholdMemberTitle('fullName', 'address')),
        childAddress: addressUI({
          omit: ['isMilitary', 'street3'],
        }),
        personWhoLivesWithChild: merge(
          {},
          {
            'ui:title': 'Who do they live with?',
            ...fullNameUI(),
          },
        ),
        monthlyPayment: merge(
          {},
          currencyUI(
            "How much do you contribute per month to your child's support?",
          ),
          {
            'ui:options': {
              classNames: 'schemaform-currency-input-v3',
            },
            'ui:required': () => true,
          },
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      dependents: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            childAddress: addressSchema({ omit: ['isMilitary', 'street3'] }),
            personWhoLivesWithChild: fullNameSchema,
            monthlyPayment: { type: 'number' },
          },
        },
      },
    },
  },
};
