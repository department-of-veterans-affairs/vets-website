import get from 'platform/utilities/data/get';
import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateSpouseTitle, showSpouseAddress } from './helpers';
import { showMultiplePageResponse } from '../../../helpers';

/** @type {PageSchema} */
export default {
  title: 'Spouse address',
  path: 'household/current-marriage/spouse-address',
  depends: formData =>
    showMultiplePageResponse() &&
    showSpouseAddress(formData) &&
    (formData.maritalStatus === 'SEPARATED' ||
      get(['view:liveWithSpouse'], formData) === false),
  uiSchema: {
    ...titleUI(generateSpouseTitle('address')),
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
