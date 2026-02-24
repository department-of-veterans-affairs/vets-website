import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { sponsorAddressCleanValidation } from '../../../shared/validations';
import content from '../../locales/en/content.json';
import { titleWithRoleUI } from '../../utils/titles';

const TITLE_TEXT = content['mailing-address--page-title'];
const DESC_TEXT = content['mailing-address--page-description'];
const CHECKBOX_LABEL = content['mailing-address--checkbox-label'];

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
