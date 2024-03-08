import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(createHouseholdMemberTitle('spouseFullName', 'address')),
    spouseAddress: addressUI({
      omit: ['isMilitary', 'street3'],
    }),
  },
  schema: {
    type: 'object',
    required: ['spouseAddress'],
    properties: {
      spouseAddress: addressSchema({ omit: ['isMilitary', 'street3'] }),
    },
  },
};
