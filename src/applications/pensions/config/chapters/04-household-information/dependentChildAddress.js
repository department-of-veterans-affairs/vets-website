import merge from 'lodash/merge';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import {
  addressUI,
  addressSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { getDependentChildTitle, dependentIsOutsideHousehold } from './helpers';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';

const {
  monthlyPayment,
} = fullSchemaPensions.properties.dependents.items.properties;

/** @type {PageSchema} */
export default {
  title: item => getDependentChildTitle(item, 'address'),
  path: 'household/dependents/children/address/:index',
  depends: dependentIsOutsideHousehold,
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
            'ui:options': {
              classNames: 'schemaform-currency-input-v3',
            },
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
            monthlyPayment,
          },
        },
      },
    },
  },
};
