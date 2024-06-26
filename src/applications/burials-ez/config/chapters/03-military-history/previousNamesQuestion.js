import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Veteran’s previous name'),
    'view:servedUnderOtherNames': {
      ...yesNoUI({
        title: 'Did the Veteran serve under another name?',
      }),
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2 vads-u-margin-top--0',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['view:servedUnderOtherNames'],
    properties: {
      'view:servedUnderOtherNames': {
        type: 'boolean',
      },
    },
  },
};
