import { validateYear } from '../validation';
import TextWidget from '../widgets/TextWidget.jsx';
import * as ReviewWidget from '../review/widgets.jsx';

export default function uiSchema(title = 'Year') {
  return {
    'ui:title': title,
    'ui:widget': TextWidget,
    'ui:reviewWidget': ReviewWidget.TextWidget,
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
