import VaTextareaField from 'platform/forms-system/src/js/web-component-fields/VaTextareaField';

import { content } from '../content/additionalInfo';

import { MAX_LENGTH } from '../../../shared/constants';

const additionalInfo = {
  uiSchema: {
    'ui:title': content.titleH1,
    additionalInfo: {
      'ui:title': content.label,
      'ui:webComponentField': VaTextareaField,
      'ui:options': {
        enableAnalytics: false,
        hint: content.hint,
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      additionalInfo: {
        type: 'string',
        maxLength: MAX_LENGTH.NOD_EXTENSION_REASON,
      },
    },
  },

  review: data => ({
    [content.title]: `${
      data.additionalInfo ? 'A' : 'No a'
    }dditional info added`,
  }),
};

export default additionalInfo;
