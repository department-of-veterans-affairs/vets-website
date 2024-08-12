// import { validateDate } from '../validation';
import MemorableDateField from 'applications/pre-need-integration/components/MemorableDateField';

export default function uiSchema(title = 'Date') {
  return {
    'ui:title': title,
    'ui:webComponentField': MemorableDateField,
    'ui:options': {
      monthSelect: false,
    },
  };
}
