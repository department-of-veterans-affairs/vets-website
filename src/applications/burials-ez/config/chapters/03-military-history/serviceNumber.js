import { ssnOrServiceNumberSchema } from 'platform/forms-system/src/js/web-component-patterns/ssnPattern';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { generateTitle, generateHelpText } from '../../../utils/helpers';
import ReviewRowView from '../../../components/ReviewRowView';

export default {
  uiSchema: {
    'ui:title': generateTitle('Service number'),
    militaryServiceNumber: {
      'ui:title': 'Military Service number',
      'ui:description': generateHelpText(
        'Enter this only if the deceased Veteran has one',
      ),
      'ui:webComponentField': VaTextInputField,
      'ui:reviewField': ReviewRowView,
      'ui:errorMessages': {
        pattern:
          'Enter a valid Social Security number or Military Service number',
      },
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceNumber: ssnOrServiceNumberSchema,
    },
  },
};
