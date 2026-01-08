import { TRIP_TYPES } from '../constants';

/**
 * Enum-like constant representing the types of validation for date fields.
 *
 * Used to control when certain validation errors should be shown:
 *  - CHANGE: triggered when the user is typing/changing the input.
 *            Required errors are NOT shown in this case.
 *  - BLUR: triggered when the input loses focus.
 *          Required errors are NOT shown in this case.
 *  - SUBMIT: triggered when the form is submitted.
 *            Required errors WILL be shown if the field is empty.
 */
export const DATE_VALIDATION_TYPE = Object.freeze({
  CHANGE: 'CHANGE',
  BLUR: 'BLUR',
  SUBMIT: 'SUBMIT',
});

/**
 * Helper to determine which fields to validate.
 *
 * If fieldName is provided, only that field is validated.
 * Otherwise, allFields are validated.
 *
 * @param {string[]} allFields - List of all fields for the expense type.
 * @param {string} [fieldName] - Optional field being updated.
 * @returns {string[]} - Array of field names to validate
 */
const getFieldsToValidate = (allFields, fieldName) => {
  return fieldName ? [fieldName] : allFields;
};

/**
 * Determines whether a date string is fully entered and represents
 * a valid calendar date in ISO YYYY-MM-DD format.
 *
 * This prevents partial, placeholder, or invalid values (e.g. "-01",
 * "2025-01", "2025-00-10", "2025-13-40") from being treated as complete.
 *
 * Used to ensure date comparisons only run when both dates are real
 * and comparable.
 */
const isCompleteDate = date => {
  if (typeof date !== 'string') return false;

  // Must strictly match YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

  const [year, month, day] = date.split('-').map(Number);

  // Validate calendar ranges
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Ensure the date actually exists (handles Feb 30, leap years, etc.)
  const parsed = new Date(year, month - 1, day);

  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
};

/**
 * Determines which air travel fields should be validated,
 * including dependent fields based on cross-field relationships.
 */
export const getAirTravelFieldsToValidate = (
  allFields,
  fieldName,
  formState,
) => {
  const fieldsToValidate = getFieldsToValidate(allFields, fieldName);
  const departureDateComplete = isCompleteDate(formState.departureDate);
  const returnDateComplete = isCompleteDate(formState.returnDate);

  // If departureDate changes and both dates are complete,
  // also validate returnDate for ordering checks
  if (
    fieldName === 'departureDate' &&
    departureDateComplete &&
    returnDateComplete &&
    !fieldsToValidate.includes('returnDate')
  ) {
    fieldsToValidate.push('returnDate');
  }

  // If returnDate changes and both dates are complete,
  // also validate departureDate for ordering checks
  if (
    fieldName === 'returnDate' &&
    returnDateComplete &&
    departureDateComplete &&
    !fieldsToValidate.includes('departureDate')
  ) {
    fieldsToValidate.push('departureDate');
  }

  // If tripType changes and a returnDate exists,
  // ensure returnDate is revalidated
  if (
    fieldName === 'tripType' &&
    formState.returnDate !== '' &&
    !fieldsToValidate.includes('returnDate')
  ) {
    fieldsToValidate.push('returnDate');
  }

  // If returnDate changes and tripType is ONE_WAY,
  // ensure tripType is revalidated
  if (
    fieldName === 'returnDate' &&
    formState.tripType === TRIP_TYPES.ONE_WAY.value &&
    !fieldsToValidate.includes('tripType')
  ) {
    fieldsToValidate.push('tripType');
  }

  return fieldsToValidate;
};

/**
 * Parses a date input from the form and returns an object with month, day, and year.
 *
 * The date input can be either:
 *  - A string in "YYYY-MM-DD" format (ISO date format), e.g. "2025-01-04"
 *  - An object with { month, day, year } properties (all strings)
 *
 * Rules:
 *  - Returns { month: null, day: null, year: null } if the input is falsy.
 *  - For string input, splits by "-" and maps to { month, day, year } in the format expected
 *    by the receipt date validation logic (month/day/year).
 *  - For object input, safely trims each field and sets null for empty values.
 *
 * @param {string|object} dateInput - The date input from the form
 * @returns {{month: string|null, day: string|null, year: string|null}} Parsed date components
 */
export const parseDateInput = dateInput => {
  if (!dateInput) return { month: null, day: null, year: null };

  // If string in "YYYY-MM-DD" format
  if (typeof dateInput === 'string') {
    const [year, month, day] = dateInput.split('-').map(p => p?.trim() || null);
    return { month, day, year };
  }

  // If object, destructure safely
  const { month, day, year } = dateInput;
  return {
    month: month?.trim() || null,
    day: day?.trim() || null,
    year: year?.trim() || null,
  };
};

/**
 * Returns an error message if the given date is in the future.
 * Expects numeric or string year, month, and day values.
 */
export const getFutureDateError = ({ year, month, day }) => {
  if (!year || !month || !day) return null;

  const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  return selectedDate > today ? "Don't enter a future date" : null;
};

/**
 * Validates the purchase date of a receipt.
 *
 * Rules:
 *  - Shows a required error only when all three date fields (month, day, year) are empty
 *    and the validation type is SUBMIT.
 *  - Shows a future-date error only when all three fields are provided.
 *  - Partial dates (e.g., only month entered) do not trigger any errors.
 *
 * There are 3 validation types:
 *  - CHANGE: don't show required error
 *  - BLUR: don't show required error
 *  - SUBMIT: show required error
 *
 * @param {string|object} dateInput - The date value from the form. Can be a string
 *                                     like "01-01-2025" or an object { month, day, year }.
 * @param {string} type - The type of validation to perform: CHANGE, BLUR, or SUBMIT.
 * @returns {{purchaseDate: string|null, isValid: boolean}} - Returns error object and validity status.
 */
export const validateReceiptDate = (dateInput, type) => {
  let error = null;

  let { month, day, year } = parseDateInput(dateInput);

  // Convert to numbers safely
  month = month ? parseInt(month, 10) : null;
  day = day ? parseInt(day, 10) : null;
  year = year ? parseInt(year, 10) : null;

  const parts = [month, day, year];
  const isAllEmpty = parts.every(p => !p);
  const isComplete = parts.every(p => Number.isInteger(p));

  if (type === DATE_VALIDATION_TYPE.SUBMIT && isAllEmpty) {
    error = 'Enter the date of your receipt';
  } else if (isComplete) {
    error = getFutureDateError({ year, month, day });
  }

  return { purchaseDate: error, isValid: !error };
};

/**
 * Validates the description field of an expense.
 *
 * Rules:
 *  - Must not be empty when type is SUBMIT.
 *  - Must be at least 5 characters long.
 *  - Must be no more than 2,000 characters long.
 *
 * @param {string} description - The value of the description field from the form.
 * @param {string} type - Validation type: CHANGE, BLUR, SUBMIT
 * @returns {{description: string|null, isValid: boolean}} - Returns error object and validity status.
 */
export const validateDescription = (description, type) => {
  let error = null;

  if (type === DATE_VALIDATION_TYPE.SUBMIT && !description) {
    error = 'Enter a description';
  } else if (description?.length > 0 && description.length < 5) {
    error = 'Enter at least 5 characters';
  } else if (description?.length > 2000) {
    error = 'Enter no more than 2,000 characters';
  }

  return { description: error, isValid: !error };
};

/**
 * Validates the requested amount field of an expense.
 *
 * Rules:
 *  - Must not be empty (SUBMIT only)
 *  - Must be a number
 *  - Must have at most 2 decimal places
 *  - Must be greater than 0
 *  - On BLUR, auto-formats to 2 decimal places (e.g., 2.5 → 2.50)
 *
 * @param {string|number} amount - The value of the costRequested field from the form.
 * @param {string} type - Validation type: CHANGE, BLUR, SUBMIT
 * @param {string} fieldName - (Optional) Name of the field in formState, defaults to 'costRequested'.
 * @returns {{errors: Object, formattedValue: string|null, isValid: boolean}} - Returns errors, formatted value for BLUR, and validity.
 */
export const validateRequestedAmount = (
  amount,
  type = DATE_VALIDATION_TYPE.SUBMIT,
  fieldName = 'costRequested',
) => {
  let error = null;
  let formattedValue = null;

  const strAmount = (amount ?? '').toString().trim();

  if (type === DATE_VALIDATION_TYPE.SUBMIT && strAmount === '') {
    error = 'Enter an amount';
  }

  if (strAmount !== '') {
    const parsed = parseFloat(strAmount);

    // Check if it's a number using regex (allow optional decimal, max 2 decimals)
    const validNumberPattern = /^\d+(\.\d*)?$/;
    if (!error && !validNumberPattern.test(strAmount)) {
      error = 'Enter an amount in numbers';
    }

    // Check decimal places (max 2)
    if (!error && strAmount.includes('.')) {
      const decimals = strAmount.split('.')[1] || '';
      if (decimals.length > 2) {
        error = 'Enter an amount using this format: x.xx';
      }
    }

    // Check greater than 0
    if (!error && parsed <= 0) {
      error = 'Enter an amount greater than 0';
    }

    // Return formatted value on BLUR if valid
    if (!error && !Number.isNaN(parsed) && type === DATE_VALIDATION_TYPE.BLUR) {
      formattedValue = parsed.toFixed(2);
    }
  }

  return {
    errors: { [fieldName]: error },
    formattedValue,
    isValid: !error,
  };
};

/**
 * Validates AirTravel expense fields for a form.
 *
 * Rules:
 *  - vendorName: required
 *  - tripType: required
 *  - departureDate: required; must be before returnDate if returnDate exists
 *  - returnDate: required if tripType === 'ROUND_TRIP'; must be after departureDate if both exist
 *  - departedFrom: required
 *  - arrivedTo: required
 *
 * Supports validating either:
 *  - All fields at once (fieldName omitted)
 *  - A single field (pass fieldName)
 *
 * @param {Object} formState - The current state of the expense form
 * @param {Object} errors - The current validation errors object
 * @param {string} [fieldName] - Optional. Name of the single field to validate
 * @returns {Object} nextErrors - Updated errors object with validation results
 */
export const validateAirTravelFields = (formState, errors, fieldName) => {
  const nextErrors = { ...errors };

  const allFields = [
    'vendorName',
    'tripType',
    'departureDate',
    'returnDate',
    'departedFrom',
    'arrivedTo',
  ];

  // Determine which fields to validate
  const fieldsToValidate = getAirTravelFieldsToValidate(
    allFields,
    fieldName,
    formState,
  );

  const departureDateComplete = isCompleteDate(formState.departureDate);
  const returnDateComplete = isCompleteDate(formState.returnDate);

  // vendorName
  if (fieldsToValidate.includes('vendorName')) {
    if (!formState.vendorName) nextErrors.vendorName = 'Enter the company name';
    else delete nextErrors.vendorName;
  }

  // tripType
  if (fieldsToValidate.includes('tripType')) {
    if (!formState.tripType) nextErrors.tripType = 'Select a trip type';
    else if (
      formState.tripType === TRIP_TYPES.ONE_WAY.value &&
      formState.returnDate
    ) {
      nextErrors.tripType = 'You entered a return date for a one-way trip';
    } else delete nextErrors.tripType;
  }

  // departureDate
  if (fieldsToValidate.includes('departureDate')) {
    const { departureDate, returnDate } = formState;

    if (!departureDate) {
      nextErrors.departureDate = 'Enter a departure date';
    } else if (departureDateComplete) {
      const [year, month, day] = departureDate.split('-');
      const futureDateError = getFutureDateError({ year, month, day });

      if (futureDateError) {
        nextErrors.departureDate = futureDateError;
      } else if (returnDateComplete && departureDate > returnDate) {
        nextErrors.departureDate = 'Departure date must be before return date';
      }
    } else {
      delete nextErrors.departureDate;
    }
  }

  // returnDate
  if (fieldsToValidate.includes('returnDate')) {
    const { tripType, departureDate, returnDate } = formState;

    if (tripType === TRIP_TYPES.ROUND_TRIP.value && !returnDate) {
      nextErrors.returnDate = 'Enter a return date';
    } else if (returnDate && returnDateComplete) {
      const [year, month, day] = returnDate.split('-');
      const futureDateError = getFutureDateError({ year, month, day });

      if (futureDateError) {
        nextErrors.returnDate = futureDateError;
      } else if (departureDateComplete && returnDate < departureDate) {
        nextErrors.returnDate = 'Return date must be later than departure date';
      } else if (tripType === TRIP_TYPES.ONE_WAY.value && returnDate) {
        nextErrors.returnDate = 'You entered a return date for a one-way trip';
      } else {
        delete nextErrors.returnDate;
      }
    } else {
      delete nextErrors.returnDate;
    }
  }

  // departedFrom
  if (fieldsToValidate.includes('departedFrom')) {
    if (!formState.departedFrom)
      nextErrors.departedFrom = 'Enter the airport name';
    else delete nextErrors.departedFrom;
  }

  // arrivedTo
  if (fieldsToValidate.includes('arrivedTo')) {
    if (!formState.arrivedTo) nextErrors.arrivedTo = 'Enter the airport name';
    else delete nextErrors.arrivedTo;
  }

  return nextErrors;
};

/**
 * Validates CommonCarrier expense fields for a form.
 *
 * Rules:
 *  - carrierType: required
 *  - reasonNotUsingPOV: required
 *
 * Supports validating either:
 *  - All fields at once (fieldName omitted)
 *  - A single field (determined via getFieldsToValidate)
 *
 * @param {Object} formState - The current state of the expense form
 * @param {Object} errors - The current validation errors object
 * @param {string} [fieldName] - Optional. Name of the field being updated.
 * @returns {Object} nextErrors - Updated errors object with validation results
 */
export const validateCommonCarrierFields = (formState, errors, fieldName) => {
  const nextErrors = { ...errors };

  // Use helper to determine which fields to validate
  const fieldsToValidate = getFieldsToValidate(
    ['carrierType', 'reasonNotUsingPOV'],
    fieldName,
  );

  // carrierType
  if (fieldsToValidate.includes('carrierType')) {
    if (!formState.carrierType)
      nextErrors.carrierType = 'Select a transportation type';
    else delete nextErrors.carrierType;
  }

  // reasonNotUsingPOV
  if (fieldsToValidate.includes('reasonNotUsingPOV')) {
    if (!formState.reasonNotUsingPOV)
      nextErrors.reasonNotUsingPOV = 'Select a reason';
    else delete nextErrors.reasonNotUsingPOV;
  }

  return nextErrors;
};

/**
 * Validates Lodging expense fields for a form.
 *
 * Rules:
 *  - vendor: required
 *  - checkInDate: required
 *  - checkOutDate: required
 *
 * Supports validating either:
 *  - All fields at once (fieldName omitted)
 *  - A single field (determined via getFieldsToValidate)
 *
 * @param {Object} formState - The current state of the expense form
 * @param {Object} errors - The current validation errors object
 * @param {string} [fieldName] - Optional. Name of the field being updated.
 * @returns {Object} nextErrors - Updated errors object with validation results
 */
export const validateLodgingFields = (formState, errors, fieldName) => {
  const nextErrors = { ...errors };

  const allFields = ['vendor', 'checkInDate', 'checkOutDate'];

  // Use helper to determine which fields to validate
  const fieldsToValidate = getFieldsToValidate(allFields, fieldName);
  const checkInDateComplete = isCompleteDate(formState.checkInDate);
  const checkOutDateComplete = isCompleteDate(formState.checkOutDate);

  // If one of the date fields is being updated, also validate the other
  if (
    fieldName === 'checkInDate' &&
    checkInDateComplete &&
    checkOutDateComplete &&
    !fieldsToValidate.includes('checkOutDate')
  ) {
    fieldsToValidate.push('checkOutDate');
  } else if (
    fieldName === 'checkOutDate' &&
    checkOutDateComplete &&
    checkInDateComplete &&
    !fieldsToValidate.includes('checkInDate')
  ) {
    fieldsToValidate.push('checkInDate');
  }

  // vendor
  if (fieldsToValidate.includes('vendor')) {
    if (!formState.vendor) nextErrors.vendor = 'Enter the name on your receipt';
    else delete nextErrors.vendor;
  }

  // checkInDate
  if (fieldsToValidate.includes('checkInDate')) {
    const { checkInDate, checkOutDate } = formState;
    if (!checkInDate) nextErrors.checkInDate = 'Enter the date you checked in';
    else if (checkInDateComplete) {
      const [year, month, day] = checkInDate.split('-');

      const futureDateError = getFutureDateError({ year, month, day });

      if (futureDateError) {
        nextErrors.checkInDate = futureDateError;
      } else if (checkOutDateComplete && checkInDate >= checkOutDate) {
        nextErrors.checkInDate =
          'Check-in date must be earlier than check-out date';
      } else {
        delete nextErrors.checkInDate;
      }
    }
  }

  // checkOutDate
  if (fieldsToValidate.includes('checkOutDate')) {
    const { checkInDate, checkOutDate } = formState;

    if (!checkOutDate) {
      nextErrors.checkOutDate = 'Enter the date you checked out';
    } else if (checkOutDateComplete) {
      const [year, month, day] = checkOutDate.split('-');

      const futureDateError = getFutureDateError({ year, month, day });

      if (futureDateError) {
        nextErrors.checkOutDate = futureDateError;
      } else if (checkInDateComplete && checkOutDate <= checkInDate) {
        nextErrors.checkOutDate =
          'Check-out date must be later than check-in date';
      }
    } else {
      delete nextErrors.checkOutDate;
    }
  }

  return nextErrors;
};

/**
 * Validates Meal expense fields for a form.
 *
 * Rules:
 *  - vendorName: required
 *
 * Can validate all fields or a single field (via `fieldName`).
 *
 * @param {Object} formState - The current state of the expense form
 * @param {Object} errors - The current validation errors object
 * @param {string} [fieldName] - Optional. Name of the field being updated.
 * @returns {Object} nextErrors - Updated errors object with validation results
 */
export const validateMealFields = (formState, errors, fieldName) => {
  const nextErrors = { ...errors };

  // Use helper to determine which fields to validate
  const fieldsToValidate = getFieldsToValidate(['vendorName'], fieldName);

  if (fieldsToValidate.includes('vendorName')) {
    nextErrors.vendorName = formState.vendorName
      ? undefined
      : 'Enter the name on your receipt';

    if (!nextErrors.vendorName) delete nextErrors.vendorName;
  }

  return nextErrors;
};
