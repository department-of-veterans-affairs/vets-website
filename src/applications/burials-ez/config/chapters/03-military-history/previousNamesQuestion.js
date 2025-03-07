import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Veteran’s previous name'),
    'view:servedUnderOtherNames': yesNoUI(
      'Did the Veteran serve under another name?',
    ),
  },
  schema: {
    type: 'object',
    required: ['view:servedUnderOtherNames'],
    properties: {
      'view:servedUnderOtherNames': yesNoSchema,
    },
  },
};
