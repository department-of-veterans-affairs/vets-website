import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

/*
 * Phone uiSchema
 *
 * @param {string} title - The field label, defaults to Phone
 */
export default function uiSchema(title = 'Phone') {
  return {
    'ui:widget': PhoneNumberWidget,
    'ui:reviewWidget': PhoneNumberReviewWidget,
    'ui:title': title,
    'ui:autocomplete': 'tel',
    'ui:errorMessages': {
      pattern:
        'Phone number should be between 10-15 digits long and only contain numbers, dashes, and parentheses',
      minLength:
        'Phone number should be between 10-15 digits long and only contain numbers, dashes, and parentheses',
      required: 'Please enter a phone number',
    },
    'ui:options': {
      widgetClassNames: 'va-input-medium-large',
    },
  };
}
