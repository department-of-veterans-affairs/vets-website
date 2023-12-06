import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { LIMITED_INFORMATION_ITEMS } from '../definitions/constants';

/** @type {PageSchema} */

export default {
  uiSchema: {
    limitedInformationItems: checkboxGroupUI({
      title: 'Which specific information do you authorize us to release?',
      description:
        'Select the items we can share with your third-party source. You can select more than one',
      labels: LIMITED_INFORMATION_ITEMS,
      required: formData => !formData.limitedInformationOther,
      labelHeaderLevel: '3',
      tile: false,
      errorMessages: {
        required:
          'Please select at least one type of information here, or specify something else below',
      },
    }),
    limitedInformationOther: {
      'ui:title': 'Other (specify here)',
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      limitedInformationItems: checkboxGroupSchema(
        Object.keys(LIMITED_INFORMATION_ITEMS),
      ),
      limitedInformationOther: {
        type: 'string',
      },
    },
  },
};
