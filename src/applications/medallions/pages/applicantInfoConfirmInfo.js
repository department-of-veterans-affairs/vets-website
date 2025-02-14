import // dateOfBirthSchema,
// dateOfBirthUI,
// fullNameNoSuffixSchema,
// fullNameNoSuffixUI,
// titleUI,
'platform/forms-system/src/js/web-component-patterns';

import { applicantInfoNoteDescription } from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': applicantInfoNoteDescription,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
