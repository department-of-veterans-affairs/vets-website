import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import PhoneNumberWidget from '../widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from '../review/PhoneNumberWidget';

export const schema = commonDefinitions.phone;

export const uiSchema = (title = 'Phone') => {
  return {
    'ui:widget': PhoneNumberWidget,
    'ui:reviewWidget': PhoneNumberReviewWidget,
    'ui:title': title,
    'ui:options': {
      widgetClassNames: 'home-phone va-input-medium-large',
      inputType: 'tel'
    }
  };
};
