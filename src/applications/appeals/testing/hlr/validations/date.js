// import { isBefore, startOfDay, subYears } from 'date-fns';

// import errorMessages from '../../../shared/content/errorMessages';
// import {
//   createScreenReaderErrorMsg,
//   createDateObject,
//   addDateErrorMessages,
// } from '../../../shared/validations/date';

// const minDate = startOfDay(subYears(new Date(), 1));

// export const validateDate = (errors, rawDateString = '') => {
//   const date = createDateObject(rawDateString);

//   const hasMessages = addDateErrorMessages(errors, errorMessages, date);

//   if (!hasMessages && isBefore(date.dateObj, minDate)) {
//     errors.addError(errorMessages.decisions.recentDate);
//     date.errors.year = true; // only the year is invalid at this point
//   }

//   // add second error message containing the part of the date with an error;
//   // used to add `aria-invalid` to the specific input
//   createScreenReaderErrorMsg(errors, date.errors);
// };

// /**
//  * Use above validation to set initial edit state
//  */
// export const isValidDate = dateString => {
//   let isValid = true;
//   const errors = {
//     addError: () => {
//       isValid = false;
//     },
//   };
//   validateDate(errors, dateString);
//   return isValid;
// };
