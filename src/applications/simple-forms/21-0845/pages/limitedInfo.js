import { LIMITED_INFORMATION_ITEMS } from '../definitions/constants';
import GroupCheckboxWidget from '../components/GroupCheckboxWidget';

/** @type {PageSchema} */
export default {
  uiSchema: {
    limitedInformationItems: {
      'ui:title': 'Which specific information do you authorize us to release?',
      'ui:description':
        'Select the items we can share with your third-party source. You can select more than one.',
      'ui:widget': GroupCheckboxWidget,
      'ui:required': formData => !formData.limitedInformationOther,
      'ui:errorMessages': {
        required: 'Please select at least one option',
      },
      'ui:options': {
        forceDivWrapper: true,
        labels: Object.values(LIMITED_INFORMATION_ITEMS),
        showFieldLabel: true,
      },
    },
    limitedInformationOther: {
      'ui:title': 'Other (specify here)',
    },
    'ui:validations': [
      (errors, fields) => {
        if (
          !fields.limitedInformationItems &&
          !fields.limitedInformationOther
        ) {
          errors.limitedInformationItems.addError(
            'Please select at least one option here, or enter unlisted item(s) in “Other” text-field below.',
          );
        }
      },
    ],
  },
  schema: {
    type: 'object',
    properties: {
      limitedInformationItems: {
        type: 'string',
      },
      limitedInformationOther: {
        type: 'string',
      },
    },
  },
};
