import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { ssnOrServiceNumberSchema } from 'platform/forms-system/src/js/web-component-patterns/ssnPattern';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import NoHintReviewField from '../../../components/NoHintReviewField';
import { generateHelpText } from '../../../utils/helpers';

export default {
  uiSchema: {
    ...titleUI('Service number'),
    militaryServiceNumber: {
      'ui:title': 'Military Service number',
      'ui:description': generateHelpText(
        'Enter this only if the deceased Veteran has one',
      ),
      'ui:webComponentField': VaTextInputField,
      'ui:reviewField': NoHintReviewField,
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
