import PhoneNumberWidget from '../widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from '../review/PhoneNumberWidget';

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
