import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

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
    'ui:webComponentField': VaTextInputField,
    'ui:autocomplete': 'tel',
    'ui:errorMessages': {
      pattern: 'Phone number should be between 10-15 digits long',
      minLength: 'Phone number should be between 10-15 digits long',
      required: 'Please enter a phone number',
    },
    'ui:options': {
      widgetClassNames: 'phone',
    },
  };
}
