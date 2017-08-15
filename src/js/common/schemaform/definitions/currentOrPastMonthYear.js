import { validateCurrentOrPastMonthYear } from '../validation';
import MonthYearWidget from '../widgets/MonthYearWidget';

export default function uiSchema(title = 'Date') {
  return {
    'ui:title': title,
    'ui:widget': MonthYearWidget,
    'ui:validations': [
      validateCurrentOrPastMonthYear
    ],
    'ui:errorMessages': {
      pattern: 'Please provide a valid current or past date'
    }
  };
}
