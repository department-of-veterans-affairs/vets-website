// import { validateDate } from '../validation';
import MemorableDateField from 'applications/pre-need-integration/components/MemorableDateField';

export default function uiSchema(title = 'Date') {
  return {
    'ui:title': title,
    // 'ui:widget': 'date',
    'ui:webComponentField': MemorableDateField,
    // 'ui:validations': [validateDate],
    // 'ui:errorMessages': {
    //   pattern: 'Please enter a valid date',
    //   required: 'Please enter a date',
    // },
    'ui:options': {
      monthSelect: false,
    },
  };
}

// import { validateDate } from '../validation';
// import MemorableDateField from '../../../../../applications/pre-need-integration/components/MemorableDateField';
// // '../components/MemorableDateField';

// export default function uiSchema(title = 'Date') {
//   return {
//     'ui:title': title,
//     'ui:webComponentField': MemorableDateField,
//     'ui:options': {
//       monthSelect: false,
//     },
//   };
// }
