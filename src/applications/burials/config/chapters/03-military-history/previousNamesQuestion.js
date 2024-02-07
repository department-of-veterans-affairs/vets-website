// import { YesNoField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import { yesNoUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Previous names'),
    'view:servedUnderOtherNames': {
      ...yesNoUI({
        title: 'Did the Veteran serve under another name?',
      }),
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2 vads-u-margin-top--0',
      },
      // 'ui:title': 'Did the Veteran serve under another name?',
      // 'ui:widget': 'yesNo', // This is required for the review page to render the field properly
      // 'ui:webComponentField': YesNoField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:servedUnderOtherNames': {
        type: 'boolean',
      },
    },
  },
};
