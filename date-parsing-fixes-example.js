/**
 * Example demonstrating the fixes for date parsing utilities
 * 
 * BEFORE: Many utilities returned strings like 'N/A' or formatted strings instead of Date objects
 * AFTER: Utilities properly return Date objects or null for consistent handling
 */

// Import the new proper date parsers
import {
  parseDateSafely,
  parseVistaDateSafely,
  parseProblemDateTimeSafely,
  parseDateFieldSafely,
  isValidDateString,
  parseVeteranDobSafely,
} from './src/platform/utilities/date/proper-date-parsers.js';

// BEFORE: AVS utilities returned 'N/A' strings on parsing failures
// parseProblemDateTime('invalid') // returned 'N/A'
// parseVistaDate('invalid') // returned 'N/A'

// AFTER: Fixed utilities return null for consistent error handling
console.log('--- AVS Utility Fixes ---');
console.log('parseProblemDateTimeSafely("Thu Apr 07 00:00:00 PDT 2005"):', 
  parseProblemDateTimeSafely("Thu Apr 07 00:00:00 PDT 2005")); // Returns Date object
console.log('parseProblemDateTimeSafely("invalid"):', 
  parseProblemDateTimeSafely("invalid")); // Returns null, not 'N/A'

console.log('parseVistaDateSafely("06/15/2023"):', 
  parseVistaDateSafely("06/15/2023")); // Returns Date object
console.log('parseVistaDateSafely("invalid"):', 
  parseVistaDateSafely("invalid")); // Returns null, not 'N/A'

// BEFORE: Appeals utilities named 'parseDate' returned formatted strings
// parseDate('2023-06-15') // returned '2023-06-15' string, not Date object

// AFTER: Added proper parsing function that returns Date objects
console.log('\n--- Appeals Utility Fixes ---');
const dateField = { year: { value: '2023' }, month: { value: '06' }, day: { value: '15' } };
console.log('parseDateFieldSafely(dateField):', 
  parseDateFieldSafely(dateField)); // Returns Date object

// BEFORE: EZR utility returned original string instead of parsed Date
// parseVeteranDob('1990-01-01') // returned '1990-01-01' string

// AFTER: Returns actual Date object
console.log('\n--- EZR Utility Fixes ---');
console.log('parseVeteranDobSafely("1990-01-01"):', 
  parseVeteranDobSafely("1990-01-01")); // Returns Date object
console.log('parseVeteranDobSafely("1899-01-01"):', 
  parseVeteranDobSafely("1899-01-01")); // Returns null (too old)

// BEFORE: Some utilities had inconsistent validation
// AFTER: Improved validation with proper type checking
console.log('\n--- Improved Validation ---');
console.log('isValidDateString("2023-06-15"):', isValidDateString("2023-06-15")); // true
console.log('isValidDateString("invalid"):', isValidDateString("invalid")); // false
console.log('isValidDateString(null):', isValidDateString(null)); // false
console.log('isValidDateString(123):', isValidDateString(123)); // false

// Demonstrate consistent error handling pattern
console.log('\n--- Consistent Error Handling ---');
const inputs = ['2023-06-15', 'invalid', null, undefined, 123];
inputs.forEach(input => {
  const result = parseDateSafely(input);
  console.log(`parseDateSafely(${JSON.stringify(input)}):`, 
    result instanceof Date ? 'Date object' : result);
});

export {
  parseDateSafely,
  parseVistaDateSafely,
  parseProblemDateTimeSafely,
  parseDateFieldSafely,
  isValidDateString,
  parseVeteranDobSafely,
};