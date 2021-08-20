// import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';
import CustomPhoneNumberWidget from './CustomPhoneNumberWidget';

/*
 * Phone uiSchema
 *
 * @param {string} title - The field label, defaults to Phone
 */
export default function CustomPhoneUI(title = 'Phone') {
  return {
    'ui:widget': CustomPhoneNumberWidget,
    'ui:reviewWidget': PhoneNumberReviewWidget,
    'ui:title': title,
    'ui:errorMessages': {
      pattern: 'Please enter a 10-digit phone number (with or without dashes)',
      minLength:
        'Please enter a 10-digit phone number (with or without dashes)',
      required: 'Please enter a phone number',
    },
    'ui:options': {
      widgetClassNames: 'va-input-medium-large',
    },
  };
}
