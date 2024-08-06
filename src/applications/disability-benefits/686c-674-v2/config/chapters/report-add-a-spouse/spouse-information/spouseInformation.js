import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle, certificateNotice } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    spouseInformation: {
      type: 'object',
      properties: {
        spouseLegalName: fullNameNoSuffixSchema,
      },
    },
    'view:certificateNotice': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  spouseInformation: {
    'ui:title': generateTitle('Spouse’s current legal name'),
    spouseLegalName: fullNameNoSuffixUI(title => `Spouse’s ${title}`),
  },
  'view:certificateNotice': {
    'ui:description': certificateNotice,
    'ui:options': {
      hideIf: formData =>
        formData?.veteranContactInformation?.veteranAddress?.country === 'USA',
    },
  },
};
