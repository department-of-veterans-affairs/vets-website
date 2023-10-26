import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { LIMITED_INFORMATION_ITEMS } from '../definitions/constants';
import { objHasEmptyValues } from '../utils';

/** @type {PageSchema} */

export default {
  uiSchema: {
    limitedInformationItems: checkboxGroupUI({
      /* TODO: Once bug #718 is fixed and merged, refactor to
      * make this required [with a function] and 
      * remove the 'ui:validations' else block below.
      */
      title: 'Which specific information do you authorize us to release?',
      description:
        'Select the items we can share with your third-party source. You can select more than one',
      labels: LIMITED_INFORMATION_ITEMS,
      // required: formdata => !formdata.limitedInformationOther,
      required: formData => !formData.limitedInformationOther,
      labelHeaderLevel: '3',
      tile: false,
      errorMessages: {},
    }),
    limitedInformationOther: {
      'ui:title': 'Other (specify here)',
    },
    'ui:validations': [
      (errors, fields) => {
        const errMsg =
          'Please select at least one type of information here, or specify something else below';
        if (
          objHasEmptyValues(fields.limitedInformationItems) &&
          typeof fields.limitedInformationOther === 'undefined'
        ) {
          errors.limitedInformationItems.addError(errMsg);
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
