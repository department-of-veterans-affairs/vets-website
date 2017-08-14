import { validateYear } from '../validation';
import TextWidget from '../widgets/TextWidget.jsx';
import * as ReviewWidget from '../review/widgets.jsx';

const uiSchema = {
  'ui:title': 'Year',
  'ui:widget': TextWidget,
  'ui:reviewWidget': ReviewWidget.TextWidget,
  'ui:validations': [
    validateYear
  ],
  'ui:errorMessages': {
    pattern: 'Please provide a valid year'
  }
};

export default uiSchema;
