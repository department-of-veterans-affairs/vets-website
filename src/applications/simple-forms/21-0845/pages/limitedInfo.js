import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { LIMITED_INFORMATION_ITEMS } from '../definitions/constants';
import { objHasEmptyValues } from '../utils';

/** @type {PageSchema} */

export default {
  uiSchema: {
    /* TODO: Once bug #718 is fixed and merged, refactor to
      * uiSchema below
      */
    limitedInformationItems: {
      // deconstruct checkboxGroupUI, so that
      // we can override the required prop with a function
      ...checkboxGroupUI({
        title: 'Which specific information do you authorize us to release?',
        description:
          'Select the items we can share with your third-party source. You can select more than one',
        labels: LIMITED_INFORMATION_ITEMS,
        required: false, // override with 'ui:required' below
        labelHeaderLevel: '3',
        tile: false,
        errorMessages: {},
      }),
      // override checkboxGroupUI's required
      'ui:required': formData => !formData.limitedInformationOther,
    },
    limitedInformationOther: {
      'ui:title': 'Other (specify here)',
      'ui:webComponentField': VaTextInputField,
    },
    'ui:validations': [
      (errors, fields) => {
        if (
          objHasEmptyValues(fields.limitedInformationItems) &&
          typeof fields.limitedInformationOther === 'undefined'
        ) {
          errors.limitedInformationItems.addError(
            'Please select at least one type of information here, or specify something else below',
          );
        } else {
          // eslint-disable-next-line no-param-reassign
          errors.limitedInformationItems = [];
        }
      },
    ],
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
