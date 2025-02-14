import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  //   finishAppLaterLink,
  applicantRelationToVetOrgHeaders,
} from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': applicantRelationToVetOrgHeaders,
    yourOrgText: textUI({
      title: 'Enter the name of the cemetery or funeral home you represent',
    }),
  },

  schema: {
    type: 'object',
    properties: {
      yourOrgText: textSchema,
    },
    required: ['yourOrgText'],
  },
};
