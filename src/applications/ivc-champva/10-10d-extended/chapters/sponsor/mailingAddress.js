import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { sponsorAddressCleanValidation } from '../../../shared/validations';
import content from '../../locales/en/content.json';
import { titleWithRoleUI } from '../../utils/titles';

const TITLE_TEXT = '%s mailing address';
const DESC_TEXT =
  'We’ll send any important information about this application to this address.';

const CHECKBOX_LABEL =
  'Address is on military base outside of the United States.';

const OPTS = { matchRole: 'sponsor', other: content['noun--veteran'] };
const PAGE_TITLE = titleWithRoleUI(TITLE_TEXT, DESC_TEXT, OPTS);

export default {
  uiSchema: {
    ...PAGE_TITLE,
    sponsorAddress: addressUI({ labels: { militaryCheckbox: CHECKBOX_LABEL } }),
    'ui:validations': [sponsorAddressCleanValidation],
  },
  schema: {
    type: 'object',
    properties: {
      sponsorAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};
