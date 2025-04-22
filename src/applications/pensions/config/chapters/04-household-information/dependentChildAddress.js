import merge from 'lodash/merge';
import {
  addressUI,
  addressSchema,
  currencyUI,
  currencySchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { showMultiplePageResponse } from '../../../helpers';
import { getDependentChildTitle, dependentIsOutsideHousehold } from './helpers';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';

/** @type {PageSchema} */
export default {
  title: item => getDependentChildTitle(item, 'address'),
  path: 'household/dependents/children/address/:index',
  depends: (formData, index) =>
    !showMultiplePageResponse() && dependentIsOutsideHousehold(formData, index),
  showPagePerItem: true,
  arrayPath: 'dependents',
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
          },
          fullNameUI(),
        ),
        monthlyPayment: merge(
          {},
          currencyUI(
            "How much do you contribute per month to your child's support?",
          ),
          {
            'ui:required': dependentIsOutsideHousehold,
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
            monthlyPayment: currencySchema,
          },
        },
      },
    },
  },
};
