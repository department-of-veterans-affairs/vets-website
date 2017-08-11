import { validateYear } from '../validation';

export default function uiSchema(title = 'Year') {
  return {
    'ui:title': title,
    'ui:widget': 'updown',
    'ui:options': {
      widgetClassNames: 'usa-input-medium'
    },
    'ui:validations': [
      validateYear
    ],
    'ui:errorMessages': {
      pattern: 'Please provide a valid year'
    }
  };
}
