import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['signer--mailing-address-title'];
const DESC_TEXT = content['address--page-description'];

const MILITARY_LABEL = content['address--label--military'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, DESC_TEXT),
    certifierAddress: addressUI({
      labels: {
        militaryCheckbox: MILITARY_LABEL,
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['certifierAddress'],
    properties: {
      certifierAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};
