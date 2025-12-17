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
 * @param {function} setExtraFieldErrors - Function to update the error state for the field.
 * @returns {boolean} - Returns true if the date is valid, false otherwise.
 */
export const validateReceiptDate = (dateInput, type, setExtraFieldErrors) => {
  // Always start by clearing any previous error
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
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    selectedDate.setHours(0, 0, 0, 0); // Normalize selected date

    if (selectedDate > today) {
      error = "Don't enter a future date";
    }
  }

  setExtraFieldErrors(prev => ({
    ...prev,
    purchaseDate: error,
  }));

  return !error;
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
 * @param {function} setExtraFieldErrors - Function to update the error state for the field.
 * @param {string} type - Validation type: CHANGE, BLUR, SUBMIT
 * @returns {boolean} - Returns true if the description is valid, false otherwise.
 */
export const validateDescription = (description, setExtraFieldErrors, type) => {
  // Always start by clearing any previous error
  let error = null;

  if (type === DATE_VALIDATION_TYPE.SUBMIT && !description) {
    error = 'Enter a description';
  } else if (description?.length > 0 && description.length < 5) {
    error = 'Enter at least 5 characters';
  } else if (description?.length > 2000) {
    error = 'Enter no more than 2,000 characters';
  }

  setExtraFieldErrors(prev => ({ ...prev, description: error }));
  return !error;
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
 * @param {function} setExtraFieldErrors - Function to update the error state for the field.
 * @param {string} type - Validation type: CHANGE, BLUR, SUBMIT
 * @param {function} setFormState - (Optional) State setter for the form, used to update the formatted value on BLUR.
 * @param {string} fieldName - (Optional) Name of the field in formState, defaults to 'costRequested'.
 * @returns {boolean} - Returns true if the requested amount is valid, false otherwise.
 */
export const validateRequestedAmount = (
  amount,
  setExtraFieldErrors,
  type = DATE_VALIDATION_TYPE.SUBMIT,
  setFormState,
  fieldName = 'costRequested',
) => {
  // Always start by clearing any previous error
  let error = null;

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

    // Auto-format to 2 decimal places on BLUR if valid
    if (
      !error &&
      !Number.isNaN(parsed) &&
      type === DATE_VALIDATION_TYPE.BLUR &&
      setFormState
    ) {
      const formatted = parsed.toFixed(2);
      setFormState(prev => ({
        ...prev,
        [fieldName]: formatted,
      }));
    }
  }

  // Update error state
  setExtraFieldErrors(prev => ({ ...prev, [fieldName]: error }));

  return !error;
};

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
  const fieldsToValidate = getFieldsToValidate(allFields, fieldName);

  // If one of the date fields is being updated, also validate the other
  if (
    fieldName === 'departureDate' &&
    !fieldsToValidate.includes('returnDate')
  ) {
    fieldsToValidate.push('returnDate');
  } else if (
    fieldName === 'returnDate' &&
    !fieldsToValidate.includes('departureDate')
  ) {
    fieldsToValidate.push('departureDate');
  }

  // vendorName
  if (fieldsToValidate.includes('vendorName')) {
    if (!formState.vendorName) nextErrors.vendorName = 'Enter the company name';
    else delete nextErrors.vendorName;
  }

  // tripType
  if (fieldsToValidate.includes('tripType')) {
    if (!formState.tripType) nextErrors.tripType = 'Select a trip type';
    else delete nextErrors.tripType;
  }

  // departureDate
  if (fieldsToValidate.includes('departureDate')) {
    if (!formState.departureDate)
      nextErrors.departureDate = 'Enter a departure date';
    else if (
      formState.returnDate &&
      formState.departureDate > formState.returnDate
    )
      nextErrors.departureDate = 'Departure date must be before return date';
    else delete nextErrors.departureDate;
  }

  // returnDate
  if (fieldsToValidate.includes('returnDate')) {
    if (
      formState.tripType === TRIP_TYPES.ROUND_TRIP.value &&
      !formState.returnDate
    ) {
      nextErrors.returnDate = 'Enter a return date';
    } else if (
      formState.departureDate &&
      formState.returnDate &&
      formState.returnDate < formState.departureDate
    ) {
      nextErrors.returnDate = 'Return date must be later than departure date';
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
