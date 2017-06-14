import PhoneNumberWidget from '../widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from '../review/PhoneNumberWidget';

export default function uiSchema(title = 'Phone') {
  return {
    'ui:widget': PhoneNumberWidget,
    'ui:reviewWidget': PhoneNumberReviewWidget,
    'ui:title': title,
    'ui:errorMessages': {
      pattern: 'Phone numbers must be 10 digits'
    },
    'ui:options': {
      widgetClassNames: 'home-phone va-input-medium-large',
      inputType: 'tel'
    }
  };
}
